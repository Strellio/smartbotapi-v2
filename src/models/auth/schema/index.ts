import mongoose from "mongoose";
import { nanoid } from "nanoid";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(32),
    },
    description: {
      type: String,
      required: false,
    },
    business: {
      type: mongoose.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export default apiKeySchema;
