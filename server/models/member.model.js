import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "SOFTWARE_ENGINEER", "REVIEWER", "MANAGER"],
      default: "SOFTWARE_ENGINEER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "SUSPENDED"],
      default: "ACTIVE",
    },

    last_login: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MemberModel = mongoose.model("Member", memberSchema);
