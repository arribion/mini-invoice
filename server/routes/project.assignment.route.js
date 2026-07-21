import express from "express";
import {
  assignTaskersToProject,
  removeTaskerFromProject,
  getProjectAssignments,
  getMyProjects,
  updateAssignmentStatus,
  getProjectTaskers,
  getAllAssignments,
} from "../controllers/admin/project.assignment.controller.js"
const project_assignment_router = express.Router();

// Create assignment(s)
project_assignment_router.post("/assign", assignTaskersToProject);

// Delete / remove assignment
project_assignment_router.delete(
  "/:assignmentId/remove",
  removeTaskerFromProject,
);

// Get all assignments (new top-level route)
project_assignment_router.get("/", getAllAssignments);

// Get assignments for a specific project (admin view)
project_assignment_router.get("/project/:projectId", getProjectAssignments);

// Update assignment status
project_assignment_router.patch("/:assignmentId", updateAssignmentStatus);

// Get my projects (tasker)
project_assignment_router.get("/my-projects", getMyProjects);

// Get project taskers (tasker view)
project_assignment_router.get("/project/:projectId/taskers", getProjectTaskers);

export default project_assignment_router;
