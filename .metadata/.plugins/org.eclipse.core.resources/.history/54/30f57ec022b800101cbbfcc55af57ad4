package com.recipeapp.service;

import com.recipeapp.entity.Comment;
import com.recipeapp.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    public Comment addComment(Comment comment) {
        return commentRepo.save(comment);
    }

    public List<Comment> getCommentsByRecipe(Long recipeId) {
        return commentRepo.findByRecipeIdOrderByCreatedAtDesc(recipeId);
    }
}
