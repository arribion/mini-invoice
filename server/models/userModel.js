import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      require: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
    avator: {
      type: String,
    },
    payoutMethod: {
      type: "BANK" | "MPESA" | "PAYPAL",
      accountName: String,
      accountNumber: String,
    },
    invitedBy: ObjectId,
    emailVerified: Boolean,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date,
    role: {
      type: String,
      enum: ["tasker", "admin", "super_admin"],
      default: "tasker",
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;