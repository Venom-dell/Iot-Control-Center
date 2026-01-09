export interface Device {
  _id: string;
  name: string;
  type: "SENSOR" | "ACTUATOR";
  status: "ONLINE" | "OFFLINE";
  lastSeen: string | null;
  token: string;
  data?: Record<string, string | number | boolean>;
}
