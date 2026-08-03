import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
  party_type: {
    type: String,
    enum: ["tasker", "admin", "owner"],
    required: true,
  },
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "party_type"
    },
    period_id: {
        type: String,
        required: true
    },
  items: [
    {
          project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
          },
      task_entries: [
          {
              type: mongoose.Schema.Types.ObjectId,
              ref: "TaskEntry"
          },
      ],
      subtotal: Number,
    },
  ],
    subtotal: {
        type: Number,
        required: true
    },
    adjustments: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
  status: {
    type: String,
    enum: ["Draft", "Issued", "Paid", "Overdue"],
    default: "Draft",
  },
    issued_at: {
        type: Date
    },
    paid_at: {
        type: Date
    },
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
