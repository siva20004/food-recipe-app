import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = false;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", { username, password });

      if (!data.success || !data.data) {
        alert(data?.message || "Invalid credentials or unapproved account.");
        return;
      }

      const { user, role } = data.data;

      if (role === "chef" && !user.approved) {
        alert("Your chef account is pending admin approval.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ ...user, role }));

      if (onLogin) onLogin(user);

      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);

      navigate("/home");
    } catch (error) {
      console.error("❌ Login error:", error);
      const msg =
        error.response?.data?.message ||
        "Failed to login. Please check your credentials.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        New here? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
