import express from "express";
import upload from "../middleware/multer.excelUpload.js";

// controllers
import {
  excelTaskUpload,
  singleTaskUpload,
  generateInvoice,
} from "../controllers/client/task.controller.js";

const taskRouter = express.Router();

taskRouter
  .post("/tasks/import/excel", upload.single("file"), excelTaskUpload)
  .post("/tasks/", singleTaskUpload)
  .get("/invoices/:projectId/:periodId", generateInvoice);

export default taskRouter;