import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  assignTaskersToProject,
  removeTaskerFromProject,
  getProjectAssignments,
  getMyProjects,
  updateAssignmentStatus,
  getProjectTaskers,
  getAllAssignments,
} from "../controllers/admin/projectAssignment.controller.js"
const project_assignment_router = express.Router();

// Create assignment(s)
project_assignment_router
  .post("/assign", assignTaskersToProject)
  .delete("/:assignmentId/remove", removeTaskerFromProject);// Delete / remove assignment

// Get all assignments
project_assignment_router
  .get("/", getAllAssignments)
  .get("/project/:projectId", getProjectAssignments) // Get assignments for a specific project (admin view)
  .patch("/:assignmentId", updateAssignmentStatus) // Update assignment status

  .get("/my-projects",protect, getMyProjects) // Get my projects (tasker)
  .get("/project/:projectId/taskers", protect, getProjectTaskers);// Get project taskers (tasker view)


export default project_assignment_router;