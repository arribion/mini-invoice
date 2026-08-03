import bcrypt from "bcrypt";
import UserModel from "../../models/userModel.js";

/**
 * Admin: Create Member
 */
export const add_member = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, status } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role,
      status,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin: Get One User by id
 */
export const get_member = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin: Get All Users
 */
export const get_all_member = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update User (admin or current user)
 * - If :id param is provided, update that user (admin flow).
 * - If no :id param, but req.user._id exists, update current user.
 * Password in updates will be hashed.
 */
export const update_member = async (req, res) => {
  try {
    // prefer explicit id param (admin usage)
    const idParam = req.params?.id;
    const targetId = idParam || req.user?._id;

    if (!targetId) {
      return res.status(400).json({
        success: false,
        message: "User id is required.",
      });
    }

    const updates = { ...req.body };

    // If password is being updated via this endpoint, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    // If email is being changed, ensure uniqueness
    if (updates.email) {
      const existingUser = await UserModel.findOne({
        email: updates.email,
        _id: { $ne: targetId },
      });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use.",
        });
      }
    }

    const user = await UserModel.findByIdAndUpdate(targetId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete User (admin)
 */
export const delete_member = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get current logged-in member (protected)
 * Endpoint: GET /api/v1/members/me
 */
export const get_current_member = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Change password for current user (protected)
 * Endpoint: PUT /api/v1/members/me/password
 * Body: { oldPassword, newPassword }
 */
export const change_password = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required.",
      });
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  add_member,
  get_member,
  get_all_member,
  update_member,
  delete_member,
  get_current_member,
  change_password,
};