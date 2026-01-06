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
      console.log(token);
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
  }, []);

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
    return <div className="bg-white rounded-lg shadow-md p-4 ">Loading...</div>;
  }

  return (
    <>
      <div className="h-screen flex flex-col gap-4">
        <NavBar />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Device
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Device"
        >
          <input
            type="text"
            placeholder="Device Name"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          >
            <option value="">Select Device Type</option>
            <option value="SENSOR">Sensor</option>
            <option value="ACTUATOR">Actuator</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => addDevice(deviceName, deviceType)}
          >
            Add Device
          </button>
        </Modal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            return (
              <DeviceCard
                device={device}
                key={device._id}
                onToggle={toggleDevice}
                onDelete={deleteDevice}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
