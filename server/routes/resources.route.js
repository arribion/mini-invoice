import express from "express";
import {
  uploadResource,
  getResources,
  deleteResource,
} from "../controllers/admin/resource.controller.js";
import upload from "../middleware/multer.js";

const resourceRouter = express.Router();

resourceRouter
  .post("/upload", upload.single("file"), uploadResource)
  .get("/get", getResources)
  .delete("/delete/:id", deleteResource);

export default resourceRouter;