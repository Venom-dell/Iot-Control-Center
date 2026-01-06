import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Device from "./pages/Device";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices/:id" element={<Device />} />
      </Routes>
    </>
  );
}

export default App;
