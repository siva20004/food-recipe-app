import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import "../styles/Profile.css";

function Navbar({ user, onLogout }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [localUser, setLocalUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser"); 
      return stored ? JSON.parse(stored) : user || null;
    } catch {
      return user || null;
    }
  });

  useEffect(() => {
    setLocalUser(user || null);
  }, [user]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "currentUser") {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          setLocalUser(newUser);
        } catch {
          setLocalUser(null);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = async () => {
    try {
      setLocalUser(null);
      localStorage.removeItem("currentUser");

      if (typeof onLogout === "function") await onLogout();
    } catch (err) {
      console.warn("Logout error:", err);
      localStorage.removeItem("currentUser");
      setLocalUser(null);
    }
  };

  const buildAvatarUrl = useCallback(
    (pic) => {
      if (!pic) return null;
      if (pic.startsWith("http")) return pic;
      return `${API_BASE}${pic.startsWith("/") ? "" : "/"}${pic}`;
    },
    [API_BASE]
  );

  const avatarSrc = localUser ? buildAvatarUrl(localUser.profilePic) : null;

  const initials = localUser
    ? (localUser.fullName || localUser.username || "")
        .split(" ")
        .filter(Boolean)
        .map((s) => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">MyRecipeHub</h1>
        <Link to="/home" className="navbar-link">
          Home
        </Link>
        <Link to="/contact" className="navbar-link">
          Contact Us
        </Link>
        <Link to="/favorites" className="navbar-link">
  Favorites ⭐
</Link>
      </div>

      <div className="navbar-right">
        {localUser ? (
          <>
            <Link to="/profile" className="navbar-avatar" title="View profile">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  className="avatar-img small"
                />
              ) : (
                <div className="avatar-fallback small">
                  <span className="fallback-icon small">{initials}</span>
                </div>
              )}
            </Link>

            <span className="navbar-user">
              Hello, <strong>{localUser.fullName || localUser.username}</strong>
            </span>

            <Link
              to={
                localUser.role === "admin"
                  ? "/admin"
                  : localUser.role === "chef"
                  ? "/chef"
                  : "/user"
              }
              className="navbar-link navbar-dashboard"
            >
              Dashboard
            </Link>

            <button onClick={handleLogout} className="navbar-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
            <Link to="/signup" className="navbar-link navbar-signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
