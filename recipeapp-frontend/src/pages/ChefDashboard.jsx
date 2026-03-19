import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeForm from "../components/RecipeForm";
import "../styles/ChefDashboard.css";

function ChefDashboard({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("myRecipes");
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/chef/recipes/${user.id}`);
        if (data.success) setRecipes(data.data);
        else alert(data.message);
      } catch (err) {
        console.error("❌ Error loading recipes:", err);
        alert("Failed to load recipes.");
      }
    };
    fetchRecipes();
  }, [user.id]);

  const addRecipe = async (recipe) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/chef/add-recipe/${user.id}`,
        recipe,
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.success) {
        setRecipes((prev) => [...prev, data.data]);
        alert("Recipe added successfully!");
        setActiveTab("myRecipes");
      } else alert(data.message);
    } catch (error) {
      console.error("❌ Add recipe error:", error);
      alert("Failed to add recipe.");
    } finally {
      setLoading(false);
    }
  };

  const updateRecipe = async (updatedRecipe) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_BASE}/api/chef/update-recipe/${updatedRecipe.id}`,
        updatedRecipe,
        { headers: { "Content-Type": "application/json" } }
      );
      if (data.success) {
        setRecipes((prev) =>
          prev.map((r) => (r.id === updatedRecipe.id ? data.data : r))
        );
        setEditingRecipe(null);
        setActiveTab("myRecipes");
        alert("Recipe updated successfully!");
      } else alert(data.message);
    } catch (error) {
      console.error("❌ Update recipe error:", error);
      alert("Failed to update recipe.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/api/chef/delete-recipe/${id}`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      alert("Recipe deleted successfully!");
    } catch (error) {
      console.error("❌ Delete recipe error:", error);
      alert("Failed to delete recipe.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (recipeId) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/comments/${recipeId}`);
      const normalized = (Array.isArray(data) ? data : data.data || []).map((c) => {
        const username = c.username || c.user || "anonymous";
        const createdAt = typeof c.createdAt === "string" ? c.createdAt : String(c.createdAt);
        return { ...c, username, createdAt };
      });
      setComments(normalized);
      setSelectedRecipe(recipes.find((r) => r.id === recipeId));
      setShowCommentsModal(true);
    } catch (err) {
      console.error("❌ Failed to fetch comments:", err);
      alert("Couldn't load comments. Try again later.");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-inner compact">
        <h2 className="dashboard-title">
          👩‍🍳 Chef Dashboard — Welcome, {user.fullName} {loading && <span>⏳</span>}
        </h2>

        <div className="dashboard-nav">
          <button
            className={activeTab === "myRecipes" ? "active" : ""}
            onClick={() => {
              setActiveTab("myRecipes");
              setEditingRecipe(null);
            }}
            disabled={loading}
          >
            📋 My Recipes
          </button>
          <button
            className={activeTab === "addRecipe" ? "active" : ""}
            onClick={() => {
              setActiveTab("addRecipe");
              setEditingRecipe(null);
            }}
            disabled={loading}
          >
            ➕ {editingRecipe ? "Edit Recipe" : "Add Recipe"}
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === "addRecipe" && (
            <RecipeForm
              onSubmit={editingRecipe ? updateRecipe : addRecipe}
              initialData={editingRecipe}
              onCancel={() => {
                setEditingRecipe(null);
                setActiveTab("myRecipes");
              }}
            />
          )}

          {activeTab === "myRecipes" && (
            <section>
              <h3>My Recipes 🍲</h3>
              {recipes.length === 0 ? (
                <p>No recipes yet. Add one!</p>
              ) : (
                <div className="recipe-grid">
                  {recipes.map((r) => (
                    <div key={r.id} className="recipe-item">
                      <div className="recipe-card">
                        <h4>{r.name}</h4>
                        <p><strong>Type:</strong> {r.type}</p>
                        <p>{r.description}</p>
                        <p><strong>Steps:</strong> {r.steps}</p>
                      </div>
                      <div className="recipe-actions">
                        <button
                          className="small-btn"
                          onClick={() => {
                            setEditingRecipe(r);
                            setActiveTab("addRecipe");
                          }}
                          disabled={loading}
                        >
                          ✏ Edit
                        </button>
                        <button
                          className="small-btn delete-btn"
                          onClick={() => deleteRecipe(r.id)}
                          disabled={loading}
                        >
                          🗑 Delete
                        </button>
                        <button
                          className="small-btn"
                          onClick={() => fetchComments(r.id)}
                        >
                          💬 View Comments
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {showCommentsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Comments for: {selectedRecipe?.name}</h3>
            <button className="close-btn" onClick={() => setShowCommentsModal(false)}>
              ✖ Close
            </button>

            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              <ul className="comment-list">
                {comments.map((c) => {
                  let displayDate = "";
                  try {
                    const dt = new Date(c.createdAt);
                    displayDate = dt.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });
                  } catch {
                    displayDate = c.createdAt || "";
                  }
                  return (
                    <li key={c.id}>
                      <strong>{c.username}</strong>: {c.text}
                      <span className="comment-date"> ({displayDate})</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChefDashboard;
