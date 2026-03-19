package com.recipeapp.repository;

import com.recipeapp.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByType(String type);
    List<Recipe> findByChefId(Long chefId);
}
