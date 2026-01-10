import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(email, password);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(email, password);
            }}
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-3 px-4 mt-6 rounded-lg hover:bg-blue-700 transition"
          onClick={() => handleLogin(email, password)}
        >
          Login
        </button>
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
