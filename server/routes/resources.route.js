import express from "express";
import upload from "../middleware/multer.js";
const resource_router = express.Router();

import uploadFile from "../controllers/resource.controller.js";

resource_router.post("/upload", upload.single("file"), uploadFile);

export default resource_router;