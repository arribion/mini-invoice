// server/models/project.Assignment.Model.js
import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ProjectAssignmentSchema = new Schema(
  {
    project_id: {
      type: Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    tasker_id: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    custom_rate: {
      type: Number,
      default: null,
    },

    assigned_at: {
      type: Date,
      default: () => new Date(),
      index: true,
    },

    status: {
      type: String,
      enum: ["ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "REMOVED"],
      default: "ASSIGNED",
      required: true,
    },

    removed_at: {
      type: Date,
      default: null,
    },

    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate assignment of same tasker to same project
ProjectAssignmentSchema.index(
  { project_id: 1, tasker_id: 1 },
  { unique: true },
);

// Optional sparse index for removed_at if you query by it
ProjectAssignmentSchema.index({ removed_at: 1 }, { sparse: true });

// Optional helper method with duplicate-key handling
ProjectAssignmentSchema.statics.assignTasker = async function (
  projectId,
  taskerId,
  opts = {},
) {
  const payload = {
    project_id: projectId,
    tasker_id: taskerId,
    custom_rate: opts.custom_rate ?? null,
    assigned_at: opts.assigned_at ?? new Date(),
    meta: opts.meta ?? {},
    status: opts.status ?? "ASSIGNED",
  };

  try {
    return await this.create(payload);
  } catch (err) {
    // Duplicate key error code from MongoDB
    if (err && err.code === 11000) {
      const message = "Tasker is already assigned to this project";
      const error = new Error(message);
      error.code = 11000;
      throw error;
    }
    throw err;
  }
};

// Check if the model already exists before creating it
const ProjectAssignment =
  mongoose.models.ProjectAssignment ||
  model("ProjectAssignment", ProjectAssignmentSchema);

export default ProjectAssignment;
