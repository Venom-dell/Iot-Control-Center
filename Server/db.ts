import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGO_URI;

export const connectToDB = async () => {
  try {
    await mongoose.connect(mongoURI as string);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
