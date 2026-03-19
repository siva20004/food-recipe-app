import React, { useState } from "react";
import axios from "axios";
import "../styles/RecipeCard.css";

function RecipeCard({ recipe, onComment, currentUser }) {
  const [comment, setComment] = useState("");
  const [showSteps, setShowSteps] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = API_BASE;
  axios.defaults.withCredentials = false;

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return alert("Please enter a comment");
    setLoading(true);

    try {
      const response = await axios.post(`/api/recipes/${recipe.id}/comments`, {
        text: comment,
        user: currentUser.username,
      });

      const newComment = response.data;
      onComment(recipe.id, newComment);
      setComment("");
    } catch (error) {
      console.error("❌ Comment submission failed:", error);
      alert("Failed to post comment. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>

      {recipe.type && (
        <div className="recipe-type-badge">
          <span>{recipe.type}</span>
        </div>
      )}

      <p className="recipe-chef">
        <strong>Chef:</strong> {recipe.chef}
      </p>

      <p className="recipe-description">{recipe.description}</p>

      <div className="recipe-buttons">
        <button className="btn-view" onClick={() => setShowSteps(!showSteps)}>
          {showSteps ? "Hide Steps" : "View Steps"}
        </button>
      </div>

      {showSteps && (
        <div className="recipe-steps-container">
          <strong>Steps to Cook:</strong>
          <div className="recipe-steps-content">{recipe.steps}</div>
        </div>
      )}

      {currentUser && (
        <div className="comment-section">
          <h4>Leave a Comment</h4>
          <div className="comment-input-wrapper">
            <input
              type="text"
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
              disabled={loading}
            />
            <button onClick={handleCommentSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeCard;
