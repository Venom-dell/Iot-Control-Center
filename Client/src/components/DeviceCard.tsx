import type { Device } from "../types/types";

interface DeviceCardProp {
  device: Device;
  onToggle: (id: string, currentStatus: string) => void;
  onDelete: (id: string) => void;
}

const DeviceCard = ({ device, onToggle, onDelete }: DeviceCardProp) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold">{device.name}</h2>
        <p>Token: {device.token}</p>
        <p className="text-gray-600">Type: {device.type}</p>
        <p
          className={
            device.status === "ONLINE" ? "text-green-500" : "text-red-500"
          }
        >
          Status: {device.status}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {device.data &&
            Object.entries(device.data).map(
              ([key, value]) =>
                key !== "status" && (
                  <div
                    key={key}
                    className="bg-gray-100 p-2 rounded border text-centered"
                  >
                    <p className="font-semibold">{key}</p>
                    <p>
                      {typeof value === "number"
                        ? value.toFixed(1)
                        : String(value)}
                    </p>
                  </div>
                )
            )}
        </div>
        {device.status === "OFFLINE" ? (
          <p className="text-gray-600">Last Seen: {device.lastSeen}</p>
        ) : null}
        <div>
          <button
            className={
              device.status === "ONLINE"
                ? "border border-red-500 text-red-500 hover:bg-red-100 rounded px-4 py-2 mt-2"
                : "border border-green-500 text-green-500 hover:bg-green-100 rounded px-4 py-2 mt-2"
            }
            onClick={() => onToggle(device._id, device.status)}
          >
            {device.status === "ONLINE" ? "Turn OFF" : "Turn ON"}
          </button>
          <button
            className="border border-red-500 text-red-500 hover:bg-red-100 rounded px-4 py-2 mt-2 ml-2"
            onClick={() => onDelete(device._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeviceCard;
