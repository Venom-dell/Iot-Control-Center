import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import Device from "./models/Device.js";
import { connectToDB } from "./db.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { authenticateToken } from "./middleware/auth.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password, username });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Failed to login user" });
  }
});

app.get(
  "/api/devices",
  authenticateToken,
  async (req: Request, res: Response) => {
    const devices = await Device.find({ userId: (req as any).user.id });
    res.json(devices);
  }
);

app.post(
  "/api/devices",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const newDevice = new Device({
        ...req.body,
        userId: (req as any).user.id,
      });
      await newDevice.save();
      res.json(newDevice);
    } catch (err) {
      console.error("Error creating device:", err);
      res.status(500).json({ error: "Failed to create device" });
    }
  }
);

app.patch(
  "/api/devices/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;
      const updatedDevice = await Device.findOneAndUpdate(
        { _id: id, userId: userId },
        req.body,
        { new: true }
      );

      if (!updatedDevice) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json(updatedDevice);
    } catch (err) {
      console.error("Error updating device:", err);
      res.status(500).json({ error: "Failed to update device" });
    }
  }
);

app.delete(
  "/api/devices/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).user.id;
      const deletedDevice = await Device.findOneAndDelete({
        _id: id,
        userId: userId,
      });
      if (!deletedDevice) {
        return res.status(404).json({ error: "Device not found" });
      }
      res.json({ message: "Device deleted successfully" });
    } catch (err) {
      console.error("Error deleting device:", err);
      res.status(500).json({ error: "Failed to delete device" });
    }
  }
);

const PORT = 3000;

const startServer = async () => {
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
