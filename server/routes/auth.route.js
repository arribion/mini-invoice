import express from "express";
const auth_router = express.Router();
import {register, login, logout, refreshToken } from "../controllers/auth.user.controller.js";
auth_router
    .post("/login", login)
    .post("/logout", logout)
    .post("/refresh-token", refreshToken);

auth_router.post("/register/user",register);

export default auth_router;