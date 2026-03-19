package com.recipeapp.controller;

import com.recipeapp.dto.ApiResponse;
import com.recipeapp.entity.Recipe;
import com.recipeapp.service.ChefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/chef")
public class ChefController {

    @Autowired
    private ChefService chefService;

    //Add new recipe
    @PostMapping("/add-recipe/{chefId}")
    public ApiResponse<Recipe> addRecipe(@PathVariable Long chefId, @RequestBody Recipe recipe) {
        try {
            Recipe saved = chefService.addRecipe(recipe, chefId);
            return new ApiResponse<>(true, "Recipe added successfully!", saved);
        } catch (Exception e) {
            return new ApiResponse<>(false, e.getMessage(), null);
        }
    }

    //Get all recipes by a chef
    @GetMapping("/recipes/{chefId}")
    public ApiResponse<List<Recipe>> getChefRecipes(@PathVariable Long chefId) {
        try {
            List<Recipe> recipes = chefService.getRecipesByChef(chefId);
            return new ApiResponse<>(true, "Recipes fetched successfully!", recipes);
        } catch (Exception e) {
            return new ApiResponse<>(false, e.getMessage(), null);
        }
    }

    //Update an existing recipe
    @PutMapping("/update-recipe/{recipeId}")
    public ApiResponse<Recipe> updateRecipe(@PathVariable Long recipeId, @RequestBody Recipe updatedRecipe) {
        try {
            Recipe updated = chefService.updateRecipe(recipeId, updatedRecipe);
            if (updated == null) return new ApiResponse<>(false, "Recipe not found!", null);
            return new ApiResponse<>(true, "Recipe updated successfully!", updated);
        } catch (Exception e) {
            return new ApiResponse<>(false, e.getMessage(), null);
        }
    }

 //Delete a recipe
    @DeleteMapping("/delete-recipe/{recipeId}")
    public ApiResponse<String> deleteRecipe(@PathVariable Long recipeId) {
        try {
            boolean deleted = chefService.deleteRecipe(recipeId);
            if (!deleted)
                return new ApiResponse<>(false, "Recipe not found or already deleted!", null);
            return new ApiResponse<>(true, "Recipe deleted successfully!", null);
        } catch (Exception e) {
            return new ApiResponse<>(false, e.getMessage(), null);
        }
    }

}
