// controllers/taskController.js
import express from "express";
import multer from "multer";
import XLSX from "xlsx";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";
import mongoose from "mongoose";
import generateInvoicePdfBuffer from "../../services/invoice.service.js";

// models (you already have these)
import projectModel from "../../models/project.model.js";
import userModel from "../../models/userModel.js";
import { TaskEntry } from "../../models/taskEntry.model.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
}); // 10MB

const EXPECTED_COLUMNS = [
  "TaskEntry ID",
  "Submission ID",
  "Task Ref",
  "Time (mm:ss)",
  "Entry Date",
  "Rate (Ksh/hr)",
  "Price (Ksh)",
  "Flag Reason",
];

function parseTimeMmSs(value) {
  if (value == null) return null;
  if (typeof value === "number") return value; // Excel time numeric fallback
  const s = String(value).trim();
  const parts = s.split(":");
  if (parts.length === 2) {
    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);
    if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
      return minutes * 60 + seconds;
    }
  }
  // try parse as decimal minutes/hours fallback
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * Ensure TaskSubmission model exists (minimal schema).
 * If you already have a model file for submissions, replace this with your import.
 */
const TaskSubmission =
  mongoose.models.TaskSubmission ||
  mongoose.model(
    "TaskSubmission",
    new mongoose.Schema(
      {
        id: { type: String, required: true, unique: true },
        tasker_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        project_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          default: null,
        },
        file_path: { type: String },
        row_count: { type: Number },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        submitted_at: { type: Date, default: Date.now },
      },
      { timestamps: true },
    ),
  );

/**
 * Ensure PaymentLedger model exists (minimal schema).
 * If you already have a ledger model, replace this with your import.
 */
const PaymentLedger =
  mongoose.models.PaymentLedger ||
  mongoose.model(
    "PaymentLedger",
    new mongoose.Schema(
      {
        id: { type: String, required: true, unique: true },
        tasker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        period_id: { type: String },
        amount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Paid"],
          default: "Pending",
        },
        calculated_at: { type: Date, default: Date.now },
        source_entry_id: { type: String }, // reference to TaskEntry.id
      },
      { timestamps: true },
    ),
  );

/**
 * POST /api/tasks/upload
 * multer middleware must be applied by the route (e.g., router.post('/upload', upload.single('file'), excelTaskUpload))
 */
export const excelTaskUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (![".xlsx", ".xls", ".csv"].includes(ext)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const workbook = XLSX.readFile(req.file.path, { cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      defval: null,
      raw: false,
    });

    const header = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
    if (!header) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
      return res.status(400).json({ error: "Empty sheet or invalid format" });
    }
    const missing = EXPECTED_COLUMNS.filter((c) => !header.includes(c));
    if (missing.length) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
      return res
        .status(400)
        .json({ error: `Missing required columns: ${missing.join(", ")}` });
    }

    const submissionId = req.body.submissionId || `sub_${Date.now()}`;
    const submissionDoc = {
      id: submissionId,
      tasker_id: req.body.taskerId || null,
      project_id: req.body.projectId || null,
      file_path: req.file.path,
      row_count: rawRows.length,
      status: "Pending",
      submitted_at: new Date(),
    };

    const entries = [];
    const errors = [];

    for (let i = 0; i < rawRows.length; i++) {
      const r = rawRows[i];
      const rowNum = i + 2;
      const taskEntryId = r["TaskEntry ID"] || null;
      const taskRef = r["Task Ref"] || null;
      const timeRaw = r["Time (mm:ss)"];
      const entryDateRaw = r["Entry Date"];
      const rateRaw = r["Rate (Ksh/hr)"];
      const priceRaw = r["Price (Ksh)"];
      const flagReason = r["Flag Reason"] || null;

      if (!taskRef) {
        errors.push({ row: rowNum, message: "Missing Task Ref" });
        continue;
      }
      const timeSeconds = parseTimeMmSs(timeRaw);
      if (timeSeconds === null) {
        errors.push({ row: rowNum, message: "Invalid Time (mm:ss)" });
        continue;
      }
      const entryDate = entryDateRaw ? dayjs(entryDateRaw).toDate() : null;
      if (!entryDate) {
        errors.push({ row: rowNum, message: "Invalid Entry Date" });
        continue;
      }
      const rate = Number(rateRaw);
      const price = Number(priceRaw);
      if (!Number.isFinite(rate) || rate < 0) {
        errors.push({ row: rowNum, message: "Invalid Rate" });
        continue;
      }
      if (!Number.isFinite(price) || price < 0) {
        errors.push({ row: rowNum, message: "Invalid Price" });
        continue;
      }

      entries.push({
        id: taskEntryId || `te_${Date.now()}_${i}`,
        submission_id: submissionDoc.id,
        task_ref: String(taskRef),
        time_seconds: timeSeconds,
        entry_date: entryDate,
        rate_ksh_per_hr: rate,
        price_ksh: price,
        flag_reason: flagReason,
        created_at: new Date(),
        tasker_id: submissionDoc.tasker_id,
        project_id: submissionDoc.project_id,
        status: "Pending",
      });
    }

    if (errors.length) {
      // keep uploaded file for debugging/audit if you prefer; returning errors so client can fix
      return res.status(422).json({ errors, parsedCount: entries.length });
    }

    // Duplicate check: find any existing TaskEntry with same project_id and task_ref
    const taskRefs = entries.map((e) => e.task_ref);
    const duplicates = await TaskEntry.find({
      project_id: submissionDoc.project_id,
      task_ref: { $in: taskRefs },
    }).select("task_ref id project_id");

    if (duplicates && duplicates.length) {
      return res
        .status(409)
        .json({ error: "Duplicate Task Ref(s) found", duplicates });
    }

    // Persist submission and entries in a transaction-like flow
    // Mongoose transactions require replica set; if not available, fallback to sequential writes
    const session = await mongoose.startSession();
    let createdSubmission = null;
    try {
      session.startTransaction();
      createdSubmission = await TaskSubmission.create([submissionDoc], {
        session,
      });
      // insertMany with session
      await TaskEntry.insertMany(entries, { session });
      await session.commitTransaction();
    } catch (txErr) {
      await session.abortTransaction();
      console.error("Transaction failed:", txErr);
      // cleanup file if desired
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
      return res.status(500).json({ error: "Failed to persist submission" });
    } finally {
      session.endSession();
    }

    return res.json({
      message: "Upload accepted",
      submissionId: submissionDoc.id,
      rows: entries.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process upload" });
  }
};

// POST /api/tasks/entry  (single task entry)
export const singleTaskUpload = async (req, res) => {
  try {
    const payload = req.body;
    const required = [
      "taskerId",
      "projectId",
      "taskRef",
      "time",
      "entryDate",
      "rate",
      "price",
    ];
    for (const f of required) {
      if (!payload[f])
        return res.status(400).json({ error: `Missing field ${f}` });
    }

    const timeSeconds = parseTimeMmSs(payload.time);
    if (timeSeconds === null)
      return res.status(400).json({ error: "Invalid time format" });

    const entryDate = dayjs(payload.entryDate).toDate();
    if (!entryDate) return res.status(400).json({ error: "Invalid entryDate" });

    const entry = {
      id: `te_${Date.now()}`,
      submission_id: null,
      task_ref: payload.taskRef,
      time_seconds: timeSeconds,
      entry_date: entryDate,
      rate_ksh_per_hr: Number(payload.rate),
      price_ksh: Number(payload.price),
      flag_reason: payload.flagReason || null,
      created_at: new Date(),
      tasker_id: payload.taskerId,
      project_id: payload.projectId,
      status: "Pending",
    };

    // duplicate check
    const exists = await TaskEntry.findOne({
      project_id: entry.project_id,
      task_ref: entry.task_ref,
    }).lean();

    if (exists)
      return res.status(409).json({ error: "TaskRef already submitted" });

    await TaskEntry.create(entry);
    return res
      .status(201)
      .json({ message: "Task entry created", id: entry.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create task entry" });
  }
};

// GET /api/invoices/:projectId/:periodId  -> returns PDF
export const generateInvoice = async (req, res) => {
  try {
    const { projectId, periodId } = req.params;

    // find approved ledger rows for project + period
    const ledgerRows = await PaymentLedger.find({
      project_id: projectId,
      period_id: periodId,
      status: "Approved",
    }).lean();

    if (!ledgerRows || ledgerRows.length === 0) {
      return res
        .status(404)
        .json({ error: "No approved entries for this project/period" });
    }

    const pdfBuffer = await generateInvoicePdfBuffer({
      projectId,
      periodId,
      ledgerRows,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${projectId}-${periodId}.pdf`,
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate invoice" });
  }
};

export default {
  excelTaskUpload,
  singleTaskUpload,
  generateInvoice,
};