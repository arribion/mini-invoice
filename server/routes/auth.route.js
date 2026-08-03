import express from "express";
import authController from "../controllers/auth.user.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/refresh", authController.refreshToken);
authRouter.get("/verify", authController.verify); // <-- new

export default authRouter;