import ProjectAssignment from "../../models/project.Assignment.Model.js";
import { ProjectModel } from "../../models/project.Model.js";
import UserModel from "../../models/userModel.js";
import mongoose from "mongoose";

// Assign taskers to a project (admin)
export const assignTaskersToProject = async (req, res) => {
  const { project_id, tasker_ids, custom_rate = null } = req.body;
  if (
    !project_id ||
    !tasker_ids ||
    !Array.isArray(tasker_ids) ||
    tasker_ids.length === 0
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please provide project_id and tasker_ids array",
      });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const project = await ProjectModel.findById(project_id).session(session);
    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.status === "CLOSED") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot assign taskers to a closed project",
        });
    }

    const taskers = await UserModel.find({
      _id: { $in: tasker_ids },
      role: "TASKER",
      status: "ACTIVE",
    }).session(session);
    if (taskers.length !== tasker_ids.length) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({
          success: false,
          message:
            "One or more taskers are invalid, not active, or not TASKER role",
        });
    }

    const existingAssignments = await ProjectAssignment.find({
      project_id: project_id,
      tasker_id: { $in: tasker_ids },
      status: { $nin: ["REMOVED", "CANCELLED"] },
    }).session(session);

    if (existingAssignments.length > 0) {
      const existingTaskerIds = existingAssignments.map((a) => a.tasker_id);
      const existingTaskerNames = existingAssignments.map(
        (a) =>
          taskers.find((t) => t._id.toString() === a.tasker_id.toString())
            ?.full_name || "Unknown",
      );
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: "Some taskers are already assigned to this project",
        data: {
          already_assigned: existingTaskerIds,
          already_assigned_names: existingTaskerNames,
        },
      });
    }

    const assignments = [];
    for (const taskerId of tasker_ids) {
      const assignment = new ProjectAssignment({
        project_id: project_id,
        tasker_id: taskerId,
        custom_rate: custom_rate,
        assigned_at: new Date(),
        status: "ASSIGNED",
      });
      await assignment.save({ session });
      assignments.push(assignment);
    }

    const updatedTaskers = [
      ...new Set([...(project.taskers || []), ...tasker_ids]),
    ];
    await ProjectModel.findByIdAndUpdate(
      project_id,
      { taskers: updatedTaskers },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const populatedAssignments = await ProjectAssignment.find({
      _id: { $in: assignments.map((a) => a._id) },
    })
      .populate("tasker_id", "full_name email avatar")
      .populate("project_id", "project_name status avg_pay");

    return res.status(201).json({
      success: true,
      message: `${assignments.length} tasker(s) assigned successfully`,
      data: {
        assignments: populatedAssignments,
        project: {
          id: project._id,
          name: project.project_name,
          custom_rate: custom_rate || project.avg_pay,
        },
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    // console.error("Error assigning taskers:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          success: false,
          message:
            "Duplicate assignment detected. Tasker already assigned to this project.",
        });
    }
    return res
      .status(500)
      .json({
        success: false,
        message: "Error assigning taskers",
        error: error.message,
      });
  }
};

// Remove tasker from project (admin)
export const removeTaskerFromProject = async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const assignment = await ProjectAssignment.findById(assignmentId);
    if (!assignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    if (assignment.status === "REMOVED")
      return res
        .status(400)
        .json({
          success: false,
          message: "Tasker is already removed from this project",
        });

    assignment.status = "REMOVED";
    assignment.removed_at = new Date();
    await assignment.save();

    const project = await ProjectModel.findById(assignment.project_id);
    if (project && project.taskers) {
      project.taskers = project.taskers.filter(
        (t) => t.toString() !== assignment.tasker_id.toString(),
      );
      await project.save();
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Tasker removed from project successfully",
        data: {
          assignment_id: assignment._id,
          project_id: assignment.project_id,
          tasker_id: assignment.tasker_id,
          status: assignment.status,
        },
      });
  } catch (error) {
    // console.error("Error removing tasker:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error removing tasker from project",
        error: error.message,
      });
  }
};

// Get assignments for a specific project (admin)
export const getProjectAssignments = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await ProjectModel.findById(projectId);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    const assignments = await ProjectAssignment.find({
      project_id: projectId,
      status: { $ne: "REMOVED" },
    })
      .populate("tasker_id", "full_name email role avatar status")
      .sort({ assigned_at: -1 });

    return res.status(200).json({
      success: true,
      data: {
        project: {
          id: project._id,
          name: project.project_name,
          default_rate: project.avg_pay,
          status: project.status,
        },
        taskers: assignments.map((a) => ({
          assignment_id: a._id,
          tasker: a.tasker_id,
          custom_rate: a.custom_rate,
          status: a.status,
          assigned_at: a.assigned_at,
        })),
        total_taskers: assignments.length,
      },
    });
  } catch (error) {
    // console.error("Error fetching assignments:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching assignments",
        error: error.message,
      });
  }
};

//  Get all assignments (top-level) — returns flat array of assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find({
      status: { $ne: "REMOVED" },
    })
      .populate("tasker_id", "full_name email role avatar status")
      .populate("project_id", "project_name status avg_pay")
      .sort({ assigned_at: -1 });

    // Return a simple array for frontend convenience
    const data = assignments.map((a) => ({
      _id: a._id,
      project_id: a.project_id?._id || a.project_id,
      tasker_id: a.tasker_id?._id || a.tasker_id,
      status: a.status,
      custom_rate: a.custom_rate,
      assigned_at: a.assigned_at,
      removed_at: a.removed_at,
      project: a.project_id
        ? {
            id: a.project_id._id,
            name: a.project_id.project_name,
            status: a.project_id.status,
            avg_pay: a.project_id.avg_pay,
          }
        : null,
      tasker: a.tasker_id
        ? {
            id: a.tasker_id._id,
            full_name: a.tasker_id.full_name,
            email: a.tasker_id.email,
          }
        : null,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    // console.error("Error fetching all assignments:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching assignments",
        error: error.message,
      });
  }
};

// Update assignment status (admin)
export const updateAssignmentStatus = async (req, res) => {
  const { assignmentId } = req.params;
  const { status } = req.body;
  const validStatuses = ["ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Invalid status. Valid statuses: ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED",
      });
  }
  try {
    const assignment = await ProjectAssignment.findById(assignmentId);
    if (!assignment)
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    assignment.status = status;
    await assignment.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Assignment status updated successfully",
        data: {
          assignment_id: assignment._id,
          status: assignment.status,
          updated_at: assignment.updatedAt,
        },
      });
  } catch (error) {
    // console.error("Error updating assignment:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error updating assignment status",
        error: error.message,
      });
  }
};

// Get my projects (tasker)
export const getMyProjects = async (req, res) => {
  const userId = req.user?._id;
  try {
    const assignments = await ProjectAssignment.find({
      tasker_id: userId,
      status: { $nin: ["REMOVED", "CANCELLED"] },
    })
      .populate({
        path: "project_id",
        select: "project_name status avg_pay description platform createdAt",
      })
      .sort({ assigned_at: -1 });

    const projects = assignments.map((a) => ({
      assignment_id: a._id,
      project: a.project_id,
      custom_rate: a.custom_rate,
      assigned_at: a.assigned_at,
      status: a.status,
      taskers_count: 0,
    }));

    for (const project of projects) {
      const count = await ProjectAssignment.countDocuments({
        project_id: project.project._id,
        status: { $nin: ["REMOVED", "CANCELLED"] },
      });
      project.taskers_count = count;
    }

    return res
      .status(200)
      .json({ success: true, data: { projects, total: projects.length } });
  } catch (error) {
    // console.error("Error fetching my projects:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching your projects",
        backend_error: error.message,
      });
  }
};

// Get project taskers (tasker view)
export const getProjectTaskers = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user?._id;
  try {
    const userAssignment = await ProjectAssignment.findOne({
      project_id: projectId,
      tasker_id: userId,
      status: { $nin: ["REMOVED", "CANCELLED"] },
    });
    if (!userAssignment)
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to view this project's taskers",
        });

    const assignments = await ProjectAssignment.find({
      project_id: projectId,
      status: { $nin: ["REMOVED", "CANCELLED"] },
    })
      .populate("tasker_id", "full_name email avatar status")
      .sort({ assigned_at: -1 });

    const project = await ProjectModel.findById(projectId).select(
      "project_name status avg_pay description",
    );

    return res.status(200).json({
      success: true,
      data: {
        project: {
          id: project._id,
          name: project.project_name,
          status: project.status,
          rate: project.avg_pay,
        },
        taskers: assignments.map((a) => ({
          assignment_id: a._id,
          full_name: a.tasker_id.full_name,
          email: a.tasker_id.email,
          avatar: a.tasker_id.avatar,
          status: a.tasker_id.status,
          assignment_status: a.status,
          assigned_at: a.assigned_at,
          is_me: a.tasker_id._id.toString() === userId.toString(),
        })),
        total_taskers: assignments.length,
      },
    });
  } catch (error) {
    // console.error("Error fetching project taskers:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching project taskers",
        error: error.message,
      });
  }
};

export default {
  assignTaskersToProject,
  removeTaskerFromProject,
  getProjectAssignments,
  getAllAssignments,
  getMyProjects,
  updateAssignmentStatus,
  getProjectTaskers,
};
