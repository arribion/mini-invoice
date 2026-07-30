import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ProjectAssignmentSchema = new Schema(
  {
    project_id: {
      type: Types.ObjectId,
      ref: "Project", // relationship with Project model
      required: true,
      index: true,
    },

    tasker_id: {
      type: Types.ObjectId,
      ref: "User", // relationship with User model
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
  { timestamps: true },
);

// Prevent duplicate assignment of same tasker to same project
ProjectAssignmentSchema.index(
  { project_id: 1, tasker_id: 1 },
  { unique: true },
);

// Sparse index for removed_at – useful for queries on non‑removed assignments
ProjectAssignmentSchema.index({ removed_at: 1 }, { sparse: true });

// Helper: assign a tasker to a project with duplicate‑key handling
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
    // Duplicate key error (MongoDB code 11000)
    if (err && err.code === 11000) {
      const error = new Error("Tasker is already assigned to this project");
      error.code = 11000;
      throw error;
    }
    throw err;
  }
};

// Prevent model overwrite on hot‑reload / multiple imports
const ProjectAssignment =
  mongoose.models.ProjectAssignment ||
  model("ProjectAssignment", ProjectAssignmentSchema);

export default ProjectAssignment;
