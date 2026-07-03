import express from "express";
const member_router = express.Router()

import {
  add_member,
  get_member,
  get_all_member,
  update_member,
  delete_member,
} from "../controllers/member.controller.js"

member_router
    .post("/add", add_member)
    .get("/get", get_member)
    .get("/all", get_all_member)
    .put("/", update_member)
    .delete("/", delete_member);

export default member_router;