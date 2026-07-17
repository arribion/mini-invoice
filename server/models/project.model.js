import mongoose from "mongoose";

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

export const ProjectModel = mongoose.model("Project", projectSchema);