import taskModel from "../../models/task.model.js";

const taskLogUpload = async (req, res) => {
    try {
        const { id, submission_id, task_ref, units_hours, entry_date, flag_reason } = req.body;
        if (!id || !submission_id || !task_ref || !units_hours || !entry_date) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }
        const newTask = new taskModel({
            id,
            submission_id,
            task_ref,
            units_hours,
            entry_date,
            flag_reason
        });
        await newTask.save();

        return res.status(201).json({
            success: true,
            message: "Task submitted successfully",
            data: newTask
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error submitting task",
            error: error.message
        });
    }
};

export default {
    taskLogUpload
};