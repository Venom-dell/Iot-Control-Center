import { useState, useEffect } from "react";
import type { Device } from "../types/types";
import DeviceCard from "../components/DeviceCard";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { API_BASE_URL } from "../config";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch");
        const data = (await response.json()) as Device[];
        setDevices(data);
      } catch (err) {
        console.error("Error fetching devices:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchDevices, 2000);
    return () => clearInterval(interval);
  }, [navigate]);

  const toggleDevice = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ONLINE" ? "OFFLINE" : "ONLINE";
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to toggle device");

      setDevices((prev) =>
        prev.map((device) =>
          device._id === id
            ? { ...device, status: newStatus as "ONLINE" | "OFFLINE" }
            : device
        )
      );
    } catch (err) {
      console.error("Error toggling device:", err);
      alert("Failed to toggle device");
    }
  };

  const addDevice = async (name: string, type: string) => {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    try {
      await fetch(`${API_BASE_URL}/api/devices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });
      setIsModalOpen(false);
      setDeviceName("");
      setDeviceType("");
    } catch (err) {
      console.error("Error adding device:", err);
      alert("Failed to add device");
    }
  };

  const deleteDevice = async (id: string) => {
    const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
    try {
      const response = await fetch(`${API_BASE_URL}/api/devices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete device");

      setDevices((prev) => prev.filter((device) => device._id !== id));
    } catch (err) {
      console.error("Error deleting device:", err);
      alert("Failed to delete device");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <NavBar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            onClick={() => setIsModalOpen(true)}
          >
            Add Device
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Device"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Device Name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            />
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            >
              <option value="">Select Device Type</option>
              <option value="SENSOR">Sensor</option>
              <option value="ACTUATOR">Actuator</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="py-2 px-4 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              onClick={() => addDevice(deviceName, deviceType)}
            >
              Add Device
            </button>
          </div>
        </Modal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devices.map((device) => (
            <DeviceCard
              device={device}
              key={device._id}
              onToggle={toggleDevice}
              onDelete={deleteDevice}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
