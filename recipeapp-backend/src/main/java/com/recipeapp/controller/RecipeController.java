package com.recipeapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import com.recipeapp.dto.ApiResponse;
import com.recipeapp.entity.*;
import com.recipeapp.repository.CommentRepository;
import com.recipeapp.repository.RecipeRepository;
import com.recipeapp.service.RecipeService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private RecipeRepository recipeRepo; 

    @Autowired
    private CommentRepository commentRepo;

    //Get all recipes
    @GetMapping
    public List<Recipe> getAll() {
        return recipeService.getAllRecipes();
    }

    //Get recipe by ID
    @GetMapping("/{id}")
    public Recipe getById(@PathVariable Long id) {
        return recipeService.getRecipeById(id);
    }

    //Get recipes by type
    @GetMapping("/type/{type}")
    public List<Recipe> getByType(@PathVariable String type) {
        return recipeService.getRecipesByType(type);
    }

    //Add comment to recipe
    @PostMapping("/{id}/comments")
    public ApiResponse<Comment> addComment(@PathVariable Long id, @RequestBody Comment commentReq) {
        Recipe recipe = recipeRepo.findById(id).orElse(null);
        if (recipe == null) {
            return new ApiResponse<>(false, "Recipe not found!", null);
        }

        Comment comment = new Comment();
        comment.setRecipeId(id);
        comment.setUsername(
                commentReq.getUsername() != null && !commentReq.getUsername().isEmpty()
                        ? commentReq.getUsername()
                        : "Anonymous");
        comment.setText(commentReq.getText());
        comment.setCreatedAt(OffsetDateTime.now(ZoneOffset.UTC));

        Comment savedComment = commentRepo.save(comment);
        return new ApiResponse<>(true, "Comment added successfully!", savedComment);
    }

    

    //Fetch all recipes by Chef ID (used by Admin Dashboard)
    @GetMapping("/byChef/{chefId}")
    public ResponseEntity<List<Recipe>> getRecipesByChef(@PathVariable Long chefId) {
        List<Recipe> recipes = recipeRepo.findByChefId(chefId);
        return ResponseEntity.ok(recipes);
    }
}
