import express from "express";
const auth_router = express.Router();

auth_router
    .post("/login", authController.login)
    .post("/register", authController.register)
    .post("/logout", authController.logout);

export default auth_router;