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
    <>
      <div className="bg-gray-100 h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(email, password);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin(email, password);
            }}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => handleLogin(email, password)}
          >
            Login
          </button>
          <Link
            to="/register"
            className="block mt-4 text-blue-500 hover:underline"
          >
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
