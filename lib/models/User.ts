import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, default: "" },
    image: { type: String, default: null },
    passwordHash: { type: String, default: null, select: false },
    isAdmin: { type: Boolean, default: false },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel =
  mongoose.models.User ?? mongoose.model("User", userSchema);
