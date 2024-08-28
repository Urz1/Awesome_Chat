import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userPrompt: { type: String, required: true },
    aiResponse: { type: String, required: true },
  },
  { timestamps: true }
);
