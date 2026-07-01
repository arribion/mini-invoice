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

    avg_pay: {
      type: Number,
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

    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "CLOSED"],
      default: "ACTIVE",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProjectModel = mongoose.model("Project", projectSchema);
