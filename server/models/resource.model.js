import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    version: {
      type: String,
      required: true
    },
  },
  { timestamps: true },
);

export const ResourceModel = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
