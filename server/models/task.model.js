import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    submission_id: {
        type: String,
        required: true,
    },
    task_ref: {
        type: String,
        required: true,
    },
    units_hours: {
        type: Number,
        required: true,
    },
    entry_date: {
        type: Date,
        required: true,
    },
    flag_reason: {
        type: String,
        required: false,
    },
});

const taskModel = mongoose.model("Task", taskSchema);

export default taskModel;