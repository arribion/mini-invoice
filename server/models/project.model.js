// server/models/project.Model.js
import mongoose from "mongoose";
import ProjectAssignment from "./project.Assignment.Model.js";
import { ResourceModel } from "./resource.model.js";
import cloudinary from "../config/cloudinary.js";

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
    taskers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// -----------------------------
// Helpers
// -----------------------------

// Remove assignments for a given project id
async function removeAssignmentsForProject(projectId, session = null) {
  if (!projectId) return;
  const filter = { project_id: projectId }; // adjust if your ProjectAssignment uses a different field name
  if (session) {
    return ProjectAssignment.deleteMany(filter).session(session);
  }
  return ProjectAssignment.deleteMany(filter);
}

// Remove resource documents for a given project id (DB-only)
async function removeResourcesForProject(projectId, session = null) {
  if (!projectId) return;
  const filter = { projectID: projectId };
  if (session) {
    return ResourceModel.deleteMany(filter).session(session);
  }
  return ResourceModel.deleteMany(filter);
}

// Best-effort: remove Cloudinary files for a project's resources, then remove DB docs
async function removeResourcesAndCloudFiles(projectId) {
  if (!projectId) return;

  // Fetch resources with publicId and type
  const resources = await ResourceModel.find({ projectID: projectId })
    .select("publicId type")
    .lean();

  if (resources && resources.length) {
    // Delete Cloudinary files in parallel (best-effort)
    await Promise.all(
      resources.map(async (r) => {
        if (!r.publicId) return;
        try {
          const resourceType =
            r.type === "image" ? "image" : r.type === "video" ? "video" : "raw";
          await cloudinary.uploader.destroy(r.publicId, {
            resource_type: resourceType,
            invalidate: true,
          });
        } catch (err) {
          // Log and continue; do not throw to avoid blocking DB cleanup
          // Replace console.error with your logger if available
          console.error(
            `Failed to delete Cloudinary file ${r.publicId}:`,
            err?.message || err,
          );
        }
      }),
    );
  }

  // Remove DB documents for resources
  await ResourceModel.deleteMany({ projectID: projectId });
}

// -----------------------------
// Middleware: cascade deletes
// -----------------------------

// Query middleware for findOneAndDelete (e.g., Model.findByIdAndDelete triggers this)
projectSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
  if (doc && doc._id) {
    // remove assignments and resources (Cloudinary + DB)
    await removeAssignmentsForProject(doc._id);
    await removeResourcesAndCloudFiles(doc._id);
  }
});

// Query middleware for deleteOne when called with a filter
projectSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
    if (doc && doc._id) {
      await removeAssignmentsForProject(doc._id);
      await removeResourcesAndCloudFiles(doc._id);
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
      await removeResourcesAndCloudFiles(this._id);
      next();
    } catch (err) {
      next(err);
    }
  },
);

// -----------------------------
// Export model
// -----------------------------
export const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;
