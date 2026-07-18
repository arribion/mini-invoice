import express from "express";
import {
  add_project,
  update_project,
  get_project,
  get_all_project,
  delete_project,
} from "../controllers/project.controller.js";

const project_router = express.Router();


project_router.post("/", add_project)
project_router.get("/", get_all_project)
project_router.get("/:id", get_project)
project_router.put("/:id", update_project)
project_router.delete("/:id", delete_project);

export default project_router;