import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // generate jwt token

        // access token with 1 hour expiration
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // refresh token with 7 days expiration
        const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        // create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            Error: error
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // generate jwt token
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in user",
            Error: error
        });
    }

};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }
        // verify refresh token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }
            const accessToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.status(200).json({
                success: true,
                message: "Access token refreshed successfully",
            });
        }
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error refreshing access token",
            Error: error
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging out user",
            Error: error
        });
    }
};

export default {
    register,
    login,
    refreshToken,
    logout
}