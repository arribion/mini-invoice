// controllers/authController.js
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET
} = process.env;
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    console.log("unable to access jwt access and refresh secrets...");
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();


    const accessToken = jwt.sign(
      { email, role: newUser.role },
      JWT_ACCESS_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { email, role: newUser.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      Error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User does not exist"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // FIX 3: Add role to payload here too
    const accessToken = jwt.sign(
      { email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: "1h" },
    );
    const refreshToken = jwt.sign(
      { email: user.email, role: user.role },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in user",
      Error: error.message,
    });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear cookies that hold JWTs or session IDs
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // If you’re using express-session, also destroy the session:
    if (req.session) {
      req.session.destroy(() => {});
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};



export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      // FIX 5: Re-embed decoded role into the newly issued access token
      const accessToken = jwt.sign(
        { email: decoded.email, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error refreshing access token",
      Error: error.message,
    });
  }
};


export default {
  register,
  logout,
    login,
    refreshToken
}