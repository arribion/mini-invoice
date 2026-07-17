import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
      select: false, // don’t return password by default
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: ["ADMIN", "MANAGER", "TASKER", "SUPER_ADMIN"],
      default: "TASKER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"],
      default: "ACTIVE",
    },

    avatar: {
      type: String,
      default: "",
    },

    payoutMethod: {
      type: {
        method: {
          type: String,
          enum: ["BANK", "MPESA", "PAYPAL"],
        },
        accountName: String,
        accountNumber: String,
      },
      default: null,
    },

    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    emailVerified: {
      type: Boolean,
      default: false,
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

const UserModel = mongoose.model("User", userSchema);

export default UserModel;