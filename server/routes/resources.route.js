import express from "express";
import {
  uploadResource,
  getResources,
  deleteResource,
} from "../controllers/admin/resource.controller.js";
<<<<<<< HEAD
import upload from "../middleware/multer.resourceFilter.js";
=======
import upload from "../middleware/multer.js";
>>>>>>> b415c5b180475e77cd627dcba0014afdb7276270

const resourceRouter = express.Router();

resourceRouter
  .post("/upload", upload.single("file"), uploadResource)
  .get("/get", getResources)
  .delete("/delete/:id", deleteResource);

export default resourceRouter;