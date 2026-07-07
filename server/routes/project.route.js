import express from "express";
import {
  add_project,
  update_project,
  get_project,
  get_all_project,
  delete_project,
} from "../controllers/project.controller.js";

const project_router = express.Router();


project_router
  .post("/add", add_project)
  .get("/get", get_all_project)
  .get("/get/:id", get_project)
  .put("/update/:id", update_project)
  .delete("/delete/:id", delete_project);

export default project_router;