import express from "express";
import { protect } from "../middleware/auth.middleware.js"; // Imported as requested
const auth_router = express.Router();
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.user.controller.js";

// Public authentication routes
auth_router
  .post("/login", login)
  .post("/logout", logout)
  .post("/refresh-token", refreshToken)
  .post("/register", register);

// Protected token verification route for React frontend
auth_router.get("/verify", protect, (req, res) => {
  // Because 'protect' runs first, req.user already contains the decoded token data
  return res.status(200).json({
    success: true,
    user: {
      email: req.user.email,
      role: req.user.role, // "client" or "admin" to match React UI expectations
    },
  });
});

export default auth_router;
