import { ProjectModel } from "../models/project.model.js";

// Create Project
export const add_project = async (req, res) => {
  try {
    const { project_name, avg_pay, platform, description, status } = req.body;

    if (!project_name || !avg_pay || !platform || !description || !status) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingProject = await ProjectModel.findOne({ project_name });

    if (existingProject) {
      return res.status(409).json({
        success: false,
        message: "Project already exists.",
      });
    }

    const project = await ProjectModel.create({
      project_name,
      avg_pay,
      platform,
      description,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Project
export const update_project = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get One Project
export const get_project = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Projects
export const get_all_project = async (req, res) => {
  try {
    const projects = await ProjectModel.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Project
export const delete_project = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  add_project,
  update_project,
  get_project,
  get_all_project,
  delete_project,
};
