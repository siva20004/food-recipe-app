package com.recipeapp.service;

import com.recipeapp.entity.Chef;
import com.recipeapp.entity.Recipe;
import com.recipeapp.repository.ChefRepository;
import com.recipeapp.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChefService {

    @Autowired
    private ChefRepository chefRepo;

    @Autowired
    private RecipeRepository recipeRepo;

    //Add a new recipe
    public Recipe addRecipe(Recipe recipe, Long chefId) {
        Chef chef = chefRepo.findById(chefId).orElse(null);
        if (chef == null || !chef.isApproved()) {
            throw new RuntimeException("Chef not approved or not found!");
        }
        recipe.setChefId(chefId);
        return recipeRepo.save(recipe);
    }

    //Get all recipes by chef ID
    public List<Recipe> getRecipesByChef(Long chefId) {
        return recipeRepo.findByChefId(chefId);
    }

    //Update recipe
    public Recipe updateRecipe(Long recipeId, Recipe updatedRecipe) {
        return recipeRepo.findById(recipeId).map(existing -> {
            existing.setName(updatedRecipe.getName());
            existing.setType(updatedRecipe.getType());
            existing.setDescription(updatedRecipe.getDescription());
            existing.setSteps(updatedRecipe.getSteps());
            return recipeRepo.save(existing);
        }).orElse(null);
    }

    //Delete recipe
    public boolean deleteRecipe(Long recipeId) {
        if (!recipeRepo.existsById(recipeId)) return false;
        recipeRepo.deleteById(recipeId);
        return true;
    }

    //Pending chefs for admin
    public List<Chef> getPendingChefs() {
        return chefRepo.findByApproved(false);
    }

    //Approve chef
    public Chef approveChef(Long id) {
        Chef chef = chefRepo.findById(id).orElse(null);
        if (chef != null) {
            chef.setApproved(true);
            chefRepo.save(chef);
        }
        return chef;
    }
}
