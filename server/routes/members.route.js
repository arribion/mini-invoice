import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  add_member,
  get_member,
  get_all_member,
  update_member,
  delete_member,
  get_current_member,
  change_password,
} from "../controllers/admin/member.controller.js";

const member_router = express.Router();

/**
 * Current user endpoints (protected)
 * Place these BEFORE the param routes so "me" doesn't get treated as :id
 */
member_router.get("/me", protect, get_current_member);
member_router.put("/me", protect, update_member);
member_router.put("/me/password", protect, change_password);
member_router.delete("/me", protect, delete_member); // optional: allow users to delete their own account

/**
 * Admin routes (existing behavior preserved)
 * - POST   /api/v1/members        -> add_member
 * - GET    /api/v1/members        -> get_all_member
 * - GET    /api/v1/members/:id    -> get_member
 * - PUT    /api/v1/members/:id    -> update_member
 * - DELETE /api/v1/members/:id    -> delete_member
 */
member_router.post("/", add_member);
member_router.get("/", get_all_member);

/**
 * If you want to be extra strict and avoid accidental non-ObjectId matches,
 * you can use a regex that matches 24-hex-character ObjectIds:
 *
 * member_router.get("/:id([0-9a-fA-F]{24})", get_member);
 * member_router.put("/:id([0-9a-fA-F]{24})", update_member);
 * member_router.delete("/:id([0-9a-fA-F]{24})", delete_member);
 *
 * Using the regex means requests like /members/me will never match the :id routes.
 */

member_router.get("/:id", get_member);
member_router.put("/:id", update_member);
member_router.delete("/:id", delete_member);

export default member_router;
