import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // refreshToken:{type: String} 
});

export const UserModel = mongoose.model("User",UserSchema)
// tchalehu