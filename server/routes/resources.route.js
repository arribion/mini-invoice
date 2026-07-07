import express from "express";
import upload from "../middleware/multer.js";
const resource_router = express.Router();

import {
    uploadResource,
    getResources,
    deleteResource
} from "../controllers/resource.controller.js";

resource_router
  .post("/upload", upload.single("file"), uploadResource)
  .get("/get", getResources)
  .delete("/delete/:publicID", deleteResource);

export default resource_router;