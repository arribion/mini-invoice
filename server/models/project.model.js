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
      type: Number,
      value: Number,
      currency: "USD" | "KES",
      rate: ["PER_TASK" | "PER_HOUR" | "PER_BATCH"],
      required: [true, "Average pay is required"],
      min: [0, "Average pay cannot be negative"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    revenueSplit: {
      tasker: Number,
      admin: Number,
      owner: Number,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "CLOSED"],
      default: "ACTIVE",
      required: true,
    },
    category: String,
    createdBy: ObjectId,
    createdAt: Date,
    updatedAt: Date,
    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "PAUSED", "CLOSED"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProjectModel = mongoose.model("Project", projectSchema);

