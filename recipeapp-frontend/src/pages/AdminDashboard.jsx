import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChef, setSelectedChef] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchChefs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/auth/chefs`);
      const chefs = res.data.data || [];
      setPending(chefs.filter((c) => c.status === "PENDING"));
      setApproved(chefs.filter((c) => c.status === "APPROVED"));
      setRejected(chefs.filter((c) => c.status === "REJECTED"));
    } catch (err) {
      console.error("Error fetching chefs:", err);
      alert("Failed to load chefs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this chef?")) return;
    try {
      await axios.put(`${API_BASE}/api/auth/approveChef/${id}`);
      alert("✅ Chef approved successfully!");
      fetchChefs();
    } catch (err) {
      alert("❌ Failed to approve chef.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this chef?")) return;
    try {
      await axios.put(`${API_BASE}/api/auth/rejectChef/${id}`);
      alert("🚫 Chef rejected!");
      fetchChefs();
    } catch (err) {
      alert("❌ Failed to reject chef.");
    }
  };

  const handleViewRecipes = async (chef) => {
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/byChef/${chef.id}`);
      const recipeData = res.data.data || res.data || [];

      if (Array.isArray(recipeData)) {
        setRecipes(recipeData);
      } else {
        setRecipes([]);
      }

      setSelectedChef(chef);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      alert("Failed to fetch recipes.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRecipes([]);
    setSelectedChef(null);
  };

  const renderChefs = (list) => (
    <div className="chef-list">
      {list.length === 0 ? (
        <p>No chefs here.</p>
      ) : (
        list.map((chef) => (
          <div className="card" key={chef.id}>
            <h4>{chef.fullName}</h4>
            <p><b>Username:</b> {chef.username}</p>
            <p><b>Email:</b> {chef.email}</p>
            <p><b>Experience:</b> {chef.experience}</p>
            <p><b>Status:</b> {chef.status}</p>

            {activeTab === "pending" && (
              <div className="action-buttons">
                <button onClick={() => handleApprove(chef.id)} className="btn-approve">
                  Approve
                </button>
                <button onClick={() => handleReject(chef.id)} className="btn-reject">
                  Reject
                </button>
              </div>
            )}

            {activeTab === "approved" && (
              <div className="action-buttons">
                <button
                  onClick={() => handleViewRecipes(chef)}
                  className="btn-view"
                >
                  🍲 View Recipes
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>👨‍🍳 Chef Approvals</h2>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pending.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approved.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "rejected" ? "active" : ""}`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({rejected.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "pending" && renderChefs(pending)}
        {activeTab === "approved" && renderChefs(approved)}
        {activeTab === "rejected" && renderChefs(rejected)}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🍲 Recipes by {selectedChef?.fullName}</h3>

            {recipes.length === 0 ? (
              <p>No recipes uploaded yet.</p>
            ) : (
              <div className="recipes-list">
                {recipes.map((r) => (
                  <div key={r.id} className="recipe-card">
                    <h4>🍴 <b>Title:</b> {r.title || r.name || "Untitled Recipe"}</h4>
                    <p><b>Description:</b> {r.description || "No description provided."}</p>
                    {r.type && <p><b>Type:</b> {r.type}</p>}
                    {r.steps && <p><b>Steps:</b> {r.steps}</p>}
                    <hr />
                  </div>
                ))}
              </div>
            )}

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
