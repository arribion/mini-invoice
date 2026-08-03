import mongoose from "mongoose";

const taskEntrySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    submission_id: {
        type: String,
        required: true
    },
    task_ref: {
        type: String,
        required: true
    },
    units_hours: {
        type: Number,
        required: true
    },
    entry_date: {
        type: Date,
        required: true
    },
    flag_reason: {
        type: String
    },
    rate_ksh_per_hr: {
        type: Number
    },
    price_ksh: {
        type: Number
    },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
    tasker_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

export const TaskEntry = mongoose.model("TaskEntry", taskEntrySchema);
