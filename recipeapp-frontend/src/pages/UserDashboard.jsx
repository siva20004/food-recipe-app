import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";

function UserDashboard({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = API_BASE;
  axios.defaults.withCredentials = false;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/recipes`);
        if (data.success) {
          setRecipes(data.data);
        } else {
          setRecipes(data);
        }
      } catch (err) {
        console.error("❌ Failed to load recipes:", err);
        alert("Failed to load recipes. Try again later.");
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`saved_${user.username}`)) || [];
    setSavedRecipes(saved);
  }, [user.username]);

  useEffect(() => {
    localStorage.setItem(`saved_${user.username}`, JSON.stringify(savedRecipes));
  }, [savedRecipes, user.username]);

  const handleComment = async (id, commentText) => {
    if (!commentText.trim()) return alert("Please enter a comment!");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/recipes/${id}/comments`, {
        text: commentText,
        user: user.username,
      });
      alert("Comment added!");
    } catch (error) {
      console.error("❌ Comment failed:", error);
      alert("Couldn't post comment.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipe) => {
    const isSaved = savedRecipes.some((r) => r.id === recipe.id);
    if (isSaved) {
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
      alert(`Removed "${recipe.name}" from saved recipes.`);
    } else {
      setSavedRecipes((prev) => [...prev, recipe]);
      alert(`Saved "${recipe.name}" successfully!`);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.some((r) => r.id === id);

  const filterRecipes = (list) =>
    list.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      const matchesType =
        filterType === "all" ||
        (r.type && r.type.toLowerCase() === filterType.toLowerCase());
      return matchesQuery && matchesType;
    });

  const filtered = filterRecipes(recipes);
  const filteredSaved = filterRecipes(savedRecipes);
  const displayRecipes = activeTab === "saved" ? filteredSaved : filtered;

  return (
    <div className="dashboard">
      <div className="dashboard-inner compact">
        <h2 className="dashboard-title">
          🍽️ Welcome, {user.fullName || user.username}!
          {loading && <span className="loading"> ⏳</span>}
        </h2>

        <div className="dashboard-nav">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All Recipes
          </button>
          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved Recipes ({savedRecipes.length})
          </button>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <p className="results-count">
          {activeTab === "saved"
            ? `You have ${filteredSaved.length} saved recipe(s)`
            : `Found ${filtered.length} recipe(s)`}
        </p>

        <div className="recipe-grid">
          {displayRecipes.length === 0 ? (
            <p className="no-results">No recipes found. Try adjusting filters.</p>
          ) : (
            displayRecipes.map((r) => (
              <div key={r.id} className="recipe-card">
                <h4>{r.name}</h4>
                <p><strong>Type:</strong> {r.type}</p>
                <p><strong>Description:</strong> {r.description}</p>
                <p><strong>Steps:</strong> {r.steps}</p>

                <div className="actions">
                  <button onClick={() => toggleSaveRecipe(r)}>
                    {isRecipeSaved(r.id) ? "💔 Unsave" : "💖 Save"}
                  </button> &nbsp;
                  <button
                    onClick={() => {
                      const comment = prompt("💬 Enter your comment:");
                      if (comment) handleComment(r.id, comment);
                    }}
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
