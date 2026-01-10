import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      if (!response.ok) throw new Error("Registration Failed");
      const data = await response.json();
      console.log(data);

      const login = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const lg_data = await login.json();
      localStorage.setItem("token", lg_data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error while registering", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Register
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRegister(email, password, username);
            }}
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRegister(email, password, username);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-transparent focus:border-blue-500 focus:bg-gray-800/60 focus:outline-none transition text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRegister(email, password, username);
            }}
          />
        </div>
        <button
          className="w-full bg-blue-600 text-white py-3 px-4 mt-6 rounded-lg hover:bg-blue-700 transition"
          onClick={() => handleRegister(email, password, username)}
        >
          Register
        </button>
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
