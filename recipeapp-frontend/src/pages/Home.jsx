import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-text">
          <h1>🍳Welcome to Cookbook Cloud!</h1>
          <p>
            Discover, cook, and share your favorite recipes from talented chefs
            worldwide.
          </p>
          
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            alt="Cooking inspiration"
          />
        </div>
      </div>

      <div className="home-features">
        <h2>🍽 What You Can Do</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png" alt="Browse" />
            <h3>Explore Recipes</h3>
            <p>Search and browse delicious recipes by name or type.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/565/565654.png" alt="Review" />
            <h3>Review & Comment</h3>
            <p>Share your thoughts and experiences with others.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/992/992700.png" alt="Save" />
            <h3>Save Favorites</h3>
            <p>Bookmark recipes to try later anytime.</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/1869/1869042.png" alt="Chef" />
            <h3>Chef Mode</h3>
            <p>Chefs can add, edit, and manage their recipes easily.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
