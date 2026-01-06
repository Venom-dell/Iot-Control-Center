import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  email: string;
  password: string;
  username: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre<User>("save", async function (this: User) {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
});

export default mongoose.model<User>("User", UserSchema);
