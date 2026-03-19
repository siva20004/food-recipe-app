package com.recipeapp.controller;

import com.recipeapp.dto.ApiResponse;
import com.recipeapp.entity.Comment;
import com.recipeapp.entity.Recipe;
import com.recipeapp.repository.CommentRepository;
import com.recipeapp.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private RecipeRepository recipeRepo;

    //Get all comments for a recipe
    @GetMapping("/{recipeId}")
    public ApiResponse<List<Comment>> getCommentsByRecipe(@PathVariable Long recipeId) {
        List<Comment> comments = commentRepo.findByRecipeIdOrderByCreatedAtDesc(recipeId);
        return new ApiResponse<>(true, "Comments fetched successfully!", comments);
    }

    //Add new comment
    @PostMapping("/{recipeId}")
    public ApiResponse<Comment> addComment(@PathVariable Long recipeId, @RequestBody Comment req) {
        Recipe recipe = recipeRepo.findById(recipeId).orElse(null);
        if (recipe == null) {
            return new ApiResponse<>(false, "Recipe not found!", null);
        }

        Comment comment = new Comment();
        comment.setRecipeId(recipeId);
        comment.setUsername(req.getUsername() != null ? req.getUsername() : "Anonymous");
        comment.setText(req.getText());
        comment.setCreatedAt(OffsetDateTime.now(ZoneOffset.UTC));

        Comment saved = commentRepo.save(comment);
        return new ApiResponse<>(true, "Comment added successfully!", saved);
    }

    //Delete a comment
    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteComment(@PathVariable Long id) {
        if (!commentRepo.existsById(id)) {
            return new ApiResponse<>(false, "Comment not found!");
        }
        commentRepo.deleteById(id);
        return new ApiResponse<>(true, "Comment deleted successfully!");
    }

    //Delete all comments for a specific recipe
    @DeleteMapping("/recipe/{recipeId}")
    public ApiResponse<Object> deleteCommentsByRecipe(@PathVariable Long recipeId) {
        commentRepo.deleteByRecipeId(recipeId);
        return new ApiResponse<>(true, "All comments for recipe deleted!");
    }
}
