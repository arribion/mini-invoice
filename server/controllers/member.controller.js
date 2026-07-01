import bcrypt from "bcryptjs";
import { MemberModel } from "../models/member.model.js";

// Create Member
export const add_member = async (req, res) => {
  try {
    const { full_name, email, password, phone, role, status } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    const existingMember = await MemberModel.findOne({ email });

    if (existingMember) {
      return res.status(409).json({
        success: false,
        message: "A member with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const member = await MemberModel.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      role,
      status,
    });

    const memberResponse = member.toObject();
    delete memberResponse.password;

    return res.status(201).json({
      success: true,
      message: "Member created successfully.",
      data: memberResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get One Member
export const get_member = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await MemberModel.findById(id).select("-password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Members
export const get_all_member = async (req, res) => {
  try {
    const members = await MemberModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Member
export const update_member = async (req, res) => {
  try {
    const { id } = req.params;

    const updates = { ...req.body };

    // Hash password if it is being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    // Prevent duplicate email
    if (updates.email) {
      const existingMember = await MemberModel.findOne({
        email: updates.email,
        _id: { $ne: id },
      });

      if (existingMember) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use.",
        });
      }
    }

    const member = await MemberModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member updated successfully.",
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Member
export const delete_member = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await MemberModel.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  add_member,
  get_member,
  get_all_member,
  update_member,
  delete_member,
};
