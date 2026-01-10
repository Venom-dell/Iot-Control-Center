import type { Device } from "../types/types";

interface DeviceCardProp {
  device: Device;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const DeviceCard = ({ device, onToggle, onDelete }: DeviceCardProp) => {
  const cardBg =
    device.status === "ONLINE" ? "bg-green-800/20" : "bg-gray-800/20";

  return (
    <div
      className={`backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl ${cardBg} border border-white/10`}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-white">{device.name}</h2>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            device.status === "ONLINE"
              ? "bg-green-500/80 text-white"
              : "bg-red-500/80 text-white"
          }`}
        >
          {device.status}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-2">Type: {device.type}</p>
      <p className="text-xs text-gray-500 mt-1 break-all overflow-hidden">
        Token: {device.token}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {device.data &&
          Object.entries(device.data).map(
            ([key, value]) =>
              key !== "status" && (
                <div
                  key={key}
                  className="bg-black/20 p-3 rounded-lg text-center"
                >
                  <p className="font-semibold text-gray-300 capitalize">
                    {key}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {typeof value === "number"
                      ? value.toFixed(1)
                      : String(value)}
                  </p>
                </div>
              )
          )}
      </div>

      {device.status === "OFFLINE" && (
        <p className="text-sm text-gray-500 mt-4">
          Last Seen: {device.lastSeen}
        </p>
      )}

      <div className="mt-6 flex gap-4">
        <button
          className={`w-full py-2 px-4 rounded-lg transition font-semibold ${
            device.status === "ONLINE"
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={() => onToggle(device._id, device.status)}
        >
          {device.status === "ONLINE" ? "Turn OFF" : "Turn ON"}
        </button>
        <button
          className="w-full py-2 px-4 rounded-lg transition font-semibold bg-gray-600 hover:bg-gray-700 text-white"
          onClick={() => onDelete(device._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
