package com.recipeapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.recipeapp.entity.Recipe;
import com.recipeapp.repository.RecipeRepository;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepo;

    //Get all recipes
    public List<Recipe> getAllRecipes() {
        return recipeRepo.findAll();
    }

    //Get recipes by type
    public List<Recipe> getRecipesByType(String type) {
        return recipeRepo.findByType(type);
    }

    //Get a recipe by ID
    public Recipe getRecipeById(Long id) {
        return recipeRepo.findById(id).orElse(null);
    }

    //Add a new recipe
    public Recipe addRecipe(Recipe recipe) {
        return recipeRepo.save(recipe);
    }

    //Update an existing recipe
    public Recipe updateRecipe(Long id, Recipe updatedRecipe) {
        Optional<Recipe> existingOpt = recipeRepo.findById(id);
        if (existingOpt.isEmpty()) return null;

        Recipe existing = existingOpt.get();
        existing.setName(updatedRecipe.getName());
        existing.setType(updatedRecipe.getType());
        existing.setDescription(updatedRecipe.getDescription());
        existing.setSteps(updatedRecipe.getSteps());
        existing.setChefId(updatedRecipe.getChefId()); 
        return recipeRepo.save(existing);
    }

    //Delete a recipe by ID
    public boolean deleteRecipe(Long id) {
        if (!recipeRepo.existsById(id)) {
            return false;
        }
        recipeRepo.deleteById(id);
        return true;
    }
}
