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
    .post("/", add_member)
    .get("/", get_all_member)
    .get("/:id", get_member)
    .put("/:id", update_member)
    .delete("/:id", delete_member);

export default member_router;