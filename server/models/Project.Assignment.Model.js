
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
      ref: "Member", // or "User" depending on your user model name
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
        
    },
    
    removed_at: {
      type: Date,
      default: null,
        },
    
    meta: {
      // optional free-form metadata
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate assignment of same tasker to same project
ProjectAssignmentSchema.index({
    project_id: 1,
    tasker_id: 1
}, { unique: true });

// Optional helper method
ProjectAssignmentSchema.statics.assignTasker = async function (projectId, taskerId, opts = {}) {
  const payload = {
    project_id: projectId,
    tasker_id: taskerId,
    custom_rate: opts.custom_rate ?? null,
    assigned_at: opts.assigned_at ?? new Date(),
    meta: opts.meta ?? {},
  };
  return this.create(payload);
};

const ProjectAssignment = model("ProjectAssignment", ProjectAssignmentSchema);
export default ProjectAssignment;