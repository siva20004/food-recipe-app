package com.recipeapp.controller;

import com.recipeapp.entity.Chef;
import com.recipeapp.repository.ChefRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private ChefRepository chefRepo;

    @GetMapping("/chefs")
    public ResponseEntity<List<Chef>> getAllChefs() {
        return ResponseEntity.ok(chefRepo.findAll());
    }

    @PutMapping("/approve-chef/{id}")
    public ResponseEntity<?> approveChef(@PathVariable Long id) {
        Optional<Chef> chefOpt = chefRepo.findById(id);
        if (chefOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Chef not found!");
        }

        Chef chef = chefOpt.get();
        chef.setApproved(true);
        chefRepo.save(chef);
        return ResponseEntity.ok("Chef " + chef.getUsername() + " has been approved!");
    }

    @PutMapping("/deactivate-chef/{id}")
    public ResponseEntity<?> deactivateChef(@PathVariable Long id) {
        Optional<Chef> chefOpt = chefRepo.findById(id);
        if (chefOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Chef not found!");
        }

        Chef chef = chefOpt.get();
        chef.setApproved(false);
        chefRepo.save(chef);
        return ResponseEntity.ok("Chef " + chef.getUsername() + " has been deactivated!");
    }
}
