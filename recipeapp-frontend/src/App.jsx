import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ChefDashboard from "./pages/ChefDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";
import Favorites from "./pages/Favorites";
// 🧩 Global Axios config
axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
axios.defaults.withCredentials = false;

function App() {
  const navigate = useNavigate();

  // ✅ Load saved user from localStorage on first render
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const [currentUser, setCurrentUser] = useState(storedUser || null);

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  // 🧠 Persist session & auto-redirect based on role
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === "admin") navigate("/admin");
    else if (currentUser.role === "chef") navigate("/chef");
    else if (currentUser.role === "user") navigate("/user");
  }, []); // run once on load

  // ============================================================
  // 🔐 LOGIN
  // ============================================================
  const handleLogin = async (loginData) => {
    try {
      const { data } = await axios.post("/api/auth/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });

      if (!data.success) {
        alert(data.message);
        return;
      }

      const { user, role } = data.data || {};

      if (!user || !role) {
        alert("Invalid login response from server!");
        return;
      }

      if (role === "chef" && !user.approved) {
        alert("Your chef account is pending admin approval.");
        return;
      }

      const userData = { ...user, role };

      // ✅ Save user to both state + localStorage
      setCurrentUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);

      // 🚀 Navigate to correct dashboard
      if (role === "admin") navigate("/admin");
      else if (role === "chef") navigate("/chef");
      else navigate("/user");
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  // ============================================================
  // 🧾 SIGNUP
  // ============================================================
  const handleSignup = async (newUser) => {
    try {
      const { data } = await axios.post("/api/auth/signup", newUser, {
        headers: { "Content-Type": "application/json" },
      });

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert(data.message || "Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert(error.response?.data?.message || "Signup failed!");
    }
  };

  // ============================================================
  // 🚪 LOGOUT
  // ============================================================
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.warn("⚠ Logout request failed (ignored):", error);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };

  // ============================================================
  // 🧩 ROUTES
  // ============================================================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route
            path="/profile"
            element={
              currentUser ? (
                <Profile
                  currentUser={currentUser}
                  users={users}
                  setUsers={setUsers}
                  setCurrentUser={setCurrentUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ==================== DASHBOARDS ==================== */}

          <Route
            path="/admin"
            element={
              currentUser?.role === "admin" ? (
                <AdminDashboard
                  users={users}
                  setUsers={setUsers}
                  recipes={recipes}
                  setRecipes={setRecipes}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/chef"
            element={
              currentUser?.role === "chef" ? (
                <ChefDashboard user={currentUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/user"
            element={
              currentUser?.role === "user" ? (
                <UserDashboard user={currentUser} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* ==================== CATCH-ALL ==================== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
