import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";

function Profile({ currentUser, setCurrentUser }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    profilePic: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = API_BASE;
  axios.defaults.withCredentials = false;

  useEffect(() => {
    if (currentUser) {
      setForm({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        experience: currentUser.experience || "",
        profilePic: currentUser.profilePic || "",
      });
    }
  }, [currentUser]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${API_BASE}/api/profile/upload-picture/${currentUser.role}/${currentUser.username}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (!data.success) {
        alert(data.message || "Failed to upload image");
        return;
      }

      const imageUrl = data.data; 

      setForm((prev) => ({ ...prev, profilePic: imageUrl }));

      const updatedUser = { ...currentUser, profilePic: imageUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const msg = document.createElement("div");
      msg.className = "toast success";
      msg.textContent = "Profile picture updated 🎉";
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    } catch (err) {
      console.error("❌ Image upload error:", err);
      alert("Failed to upload image. Check backend logs for details.");
    } finally {
      setUploading(false);
    }
  };

  const removePicture = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/profile/update/${currentUser.role}/${currentUser.username}`,
        { profilePic: "" }
      );

      const updatedUser = { ...currentUser, profilePic: "" };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setForm((prev) => ({ ...prev, profilePic: "" }));

      const msg = document.createElement("div");
      msg.className = "toast warning";
      msg.textContent = "Profile picture removed 🗑️";
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    } catch (err) {
      alert("Failed to remove picture.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/profile/update/${currentUser.role}/${currentUser.username}`,
        form
      );

      if (!data.success && data.error) {
        alert(data.error);
      } else {
        const updatedUser = { ...currentUser, ...form };
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        const msg = document.createElement("div");
        msg.className = "toast success";
        msg.textContent = "Profile updated ✨";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      alert(
        error.response?.data?.message || "Failed to update profile. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!oldPassword || !newPassword || !confirmPassword)
      return alert("All password fields are required.");
    if (newPassword.length < 6)
      return alert("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return alert("Passwords do not match.");

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/profile/change-password/${currentUser.role}/${currentUser.username}`,
        { oldPassword, newPassword }
      );

      if (!data.success && data.error) {
        alert(data.error);
      } else {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordBox(false);

        const msg = document.createElement("div");
        msg.className = "toast success";
        msg.textContent = "Password updated 🔑";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2000);
      }
    } catch (error) {
      console.error("❌ Password reset error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-page">
        <p className="no-user">Please log in to access your profile.</p>
      </div>
    );
  }

  const isChef = currentUser.role === "chef";

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="avatar-wrapper">
            {form.profilePic ? (
              <img
                src={
                  form.profilePic.startsWith("http")
                    ? form.profilePic
                    : `${API_BASE}${form.profilePic}`
                }
                alt="avatar"
                className="avatar-img"
              />
            ) : (
              <div className="avatar-fallback">
                <span className="fallback-icon">👤</span>
              </div>
            )}
          </div>

          <label className="file-label">
            {uploading ? "Uploading..." : "Change Picture"}
            <input type="file" accept="image/*" onChange={onFile} disabled={uploading} />
          </label>

          {form.profilePic && (
            <button type="button" className="btn-remove" onClick={removePicture}>
              Remove Picture
            </button>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Role</label>
            <input value={currentUser.role} readOnly />
          </div>

          {isChef && (
            <div className="form-row">
              <label>Experience</label>
              <textarea
                name="experience"
                rows="3"
                value={form.experience}
                onChange={onChange}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-save">
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>

      <div className="password-section">
        <button
          className="btn-toggle"
          onClick={() => setShowPasswordBox((prev) => !prev)}
        >
          {showPasswordBox ? "🔒 Hide Password Settings" : "🔑 Change Password"}
        </button>

        {showPasswordBox && (
          <form className="password-form" onSubmit={handlePasswordChange}>
            <div className="form-row">
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
            </div>
            <div className="form-row">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
            <button type="submit" className="btn-save">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
