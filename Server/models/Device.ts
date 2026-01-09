import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export interface Device extends Document {
  name: string;
  type: "SENSOR" | "ACTUATOR";
  status: "ONLINE" | "OFFLINE";
  lastUpdated: Date;
  userId: string;
  token: string;
  data: any;
}

const DeviceSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["SENSOR", "ACTUATOR"], required: true },
  status: { type: String, enum: ["ONLINE", "OFFLINE"], default: "OFFLINE" },
  lastUpdated: { type: String, default: Date.now.toString() },
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, default: {}, minimize: false },
});

export default mongoose.model<Device>("Device", DeviceSchema);
