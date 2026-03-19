package com.recipeapp.repository;

import com.recipeapp.entity.Chef;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChefRepository extends JpaRepository<Chef, Long> {
    Optional<Chef> findByUsername(String username);
    List<Chef> findByApproved(boolean approved);
    List<Chef> findByStatus(String status);
}
