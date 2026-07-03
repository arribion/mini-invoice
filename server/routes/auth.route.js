import express from "express";
const auth_router = express.Router();
import * as authController from "../controllers/auth.controller.js";
auth_router
    .post("/login", authController.login)
    .post("/logout", authController.logout)
    .post("/refresh-token", authController.refreshToken);

auth_router.post("/register/user", authController.register);

export default auth_router;