import mongoose from "mongoose";
import ProjectAssignment from "./Project.Assignment.Model";

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

    rate: {
      amount: {
        type: Number,
        required: [true, "Average pay is required"],
        min: [0, "Average pay cannot be negative"],
      },
      currency: {
        type: String,
        enum: ["USD", "KES"],
        required: true,
      },
      type: {
        type: String,
        enum: ["PER_TASK", "PER_HOUR", "PER_BATCH"],
        required: true,
      },
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
      enum: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED"],
      default: "ACTIVE",
      required: true,
    },

    category: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Helper to remove assignments for a given project id
async function removeAssignmentsForProject(projectId, session = null) {
  const filter = { project_id: projectId };
  if (session) {
    return ProjectAssignment.deleteMany(filter).session(session);
  }
  return ProjectAssignment.deleteMany(filter);
}

// Query middleware for findOneAndDelete / findByIdAndDelete
ProjectSchema.pre("findOneAndDelete", async function (next) {
  try {
    // `this` is the query. Get the document to be deleted.
    const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
    if (doc && doc._id) {
      await removeAssignmentsForProject(doc._id);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Query middleware for deleteOne when called with a filter
ProjectSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  try {
    const doc = await this.model.findOne(this.getQuery()).select("_id").lean();
    if (doc && doc._id) {
      await removeAssignmentsForProject(doc._id);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Instance middleware for remove()
ProjectSchema.pre("remove", { document: true, query: false }, async function (next) {
  try {
    await removeAssignmentsForProject(this._id);
    next();
  } catch (err) {
    next(err);
  }
});

export const ProjectModel = mongoose.model("Project", projectSchema);