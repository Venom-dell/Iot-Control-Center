const devices = await fetch("http://localhost:3000/api/devices").then((res) =>
  res.json()
);

setInterval(async () => {
  let device = devices[Math.floor(Math.random() * devices.length)];
  let status = Math.random() > 0.5 ? "ONLINE" : "OFFLINE";
  await fetch(`http://localhost:3000/api/devices/${device._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
    }),
  });
}, 2000);
