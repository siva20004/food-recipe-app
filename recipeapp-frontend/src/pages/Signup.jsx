import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Signup({ onSignup }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role before proceeding!");
      return;
    }

    if (!fullName || !username || !password || !email || !phone) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName,
        username,
        password,
        email,
        phone,
        role,
        experience: role === "chef" ? experience : "",
      };

      const { data } = await axios.post(`${API_BASE}/api/auth/signup`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        if (role === "chef") {
          alert("Signup successful! Please wait for admin approval before logging in.");
        } else {
          alert("Signup successful! You can now log in.");
        }
        navigate("/login");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert(error.response?.data?.message || "Signup failed. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>

      <div className="role-selector">
        <label htmlFor="role" style={{ fontWeight: "500", display: "block", marginBottom: "8px" }}>
          Select your role:
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">-- Choose Role --</option>
          <option value="user">👤 User</option>
          <option value="chef">👨‍🍳 Chef</option>
        </select>
      </div>

      {role && (
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {role === "chef" && (
            <input
              type="text"
              placeholder="Experience (e.g., 5 years)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      )}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
