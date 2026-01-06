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

app.get(
  "/api/devices",
  authenticateToken,
  async (req: Request, res: Response) => {
    const devices = await Device.find({});
    res.json(devices);
  }
);

app.post(
  "/api/devices",
  authenticateToken,
  async (req: Request, res: Response) => {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.json(newDevice);
  }
);

app.patch("/api/devices/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedDevice = await Device.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedDevice);
  } catch (err) {
    console.error("Error updating device:", err);
    res.status(500).json({ error: "Failed to update device" });
  }
});

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

app.delete("/api/devices/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Device.findByIdAndDelete(id);
    res.json({ message: "Device deleted successfully" });
  } catch (err) {
    console.error("Error deleting device:", err);
    res.status(500).json({ error: "Failed to delete device" });
  }
});

const PORT = 3000;

const startServer = async () => {
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
