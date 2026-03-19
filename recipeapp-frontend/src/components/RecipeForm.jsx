import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/RecipeForm.css";

function RecipeForm({ onSubmit, initialData, onCancel }) {
  const [recipe, setRecipe] = useState({
    id: null,
    name: "",
    type: "",
    description: "",
    steps: "",
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = API_BASE;

  useEffect(() => {
    if (initialData) {
      setRecipe({
        id: initialData.id || null,
        name: initialData.name || "",
        type: initialData.type || "",
        description: initialData.description || "",
        steps: initialData.steps || "",
      });
    } else {
      setRecipe({ id: null, name: "", type: "", description: "", steps: "" });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipe.name || !recipe.type || !recipe.description || !recipe.steps) {
      return alert("Please fill all fields!");
    }

    setLoading(true);
    try {
      await onSubmit(recipe);
    } catch (err) {
      console.error("❌ Recipe save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Edit Recipe" : "Add New Recipe"}</h3>

      <input
        type="text"
        placeholder="Recipe Name (e.g., Chocolate Cake)"
        value={recipe.name}
        onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
        required
      />

      <select
        value={recipe.type}
        onChange={(e) => setRecipe({ ...recipe, type: e.target.value })}
        required
      >
        <option value="">Select Recipe Type</option>
        <option value="breakfast">🌅 Breakfast</option>
        <option value="lunch">🍱 Lunch</option>
        <option value="dinner">🍽️ Dinner</option>
        <option value="dessert">🍰 Dessert</option>
        <option value="snack">🍿 Snack</option>
      </select>

      <textarea
        placeholder="Short Description"
        value={recipe.description}
        onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
        rows="3"
        required
      />

      <textarea
        placeholder="Step-by-step instructions..."
        value={recipe.steps}
        onChange={(e) => setRecipe({ ...recipe, steps: e.target.value })}
        rows="5"
        required
      />

      <div className="form-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Recipe" : "Add Recipe"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default RecipeForm;
