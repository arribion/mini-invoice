import mongoose from "mongoose";
import ProjectAssignment from "./Project.Assignment.Model.js";

const projectSchema = new mongoose.Schema(
  {
    project_name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    platform: {
      type: String,
      required: [true, "Platform is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    avg_pay: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },

    revenueSplit: {
      tasker: { type: Number, default: 0 },
      admin: { type: Number, default: 0 },
      owner: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "ACTIVE", "PAUSED", "CLOSED"],
      default: "ACTIVE",
      required: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Helper to remove assignments for a given project id
async function removeAssignmentsForProject(projectId, session = null) {
  if (!projectId) return;
  const filter = { project_id: projectId };
  if (session) {
    return ProjectAssignment.deleteMany(filter).session(session);
  }
  return ProjectAssignment.deleteMany(filter);
}

// Query middleware for findOneAndDelete
projectSchema.pre("findOneAndDelete", async function () {
  // `this` is the query
  const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
  if (doc && doc._id) {
    await removeAssignmentsForProject(doc._id);
  }
});

// Query middleware for deleteOne when called with a filter
projectSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    // `this` is the query
    const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
    if (doc && doc._id) {
      await removeAssignmentsForProject(doc._id);
    }
  },
);

// Instance middleware for remove()
projectSchema.pre(
  "remove",
  { document: true, query: false },
  async function (next) {
    try {
      await removeAssignmentsForProject(this._id);
      next();
    } catch (err) {
      next(err);
    }
  },
);

export const ProjectModel = mongoose.model("Project", projectSchema);