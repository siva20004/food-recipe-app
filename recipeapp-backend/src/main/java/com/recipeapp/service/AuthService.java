package com.recipeapp.service;

import com.recipeapp.dto.LoginRequest;
import com.recipeapp.dto.SignupRequest;
import com.recipeapp.entity.*;
import com.recipeapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private ChefRepository chefRepo;
    @Autowired private AdminRepository adminRepo;

    //SIGNUP
    public Object registerUser(SignupRequest req) {
        if (req.getUsername() == null || req.getPassword() == null)
            throw new IllegalArgumentException("Username and password are required.");

        if (userRepo.findByUsername(req.getUsername()).isPresent() ||
            chefRepo.findByUsername(req.getUsername()).isPresent() ||
            adminRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }

        switch (req.getRole().toLowerCase()) {
            case "user" -> {
                User user = new User();
                user.setFullName(req.getFullName());
                user.setUsername(req.getUsername());
                user.setPassword(req.getPassword());
                user.setEmail(req.getEmail());
                user.setPhone(req.getPhone());
                user.setRole("user");
                return userRepo.save(user);
            }
            case "chef" -> {
                Chef chef = new Chef();
                chef.setFullName(req.getFullName());
                chef.setUsername(req.getUsername());
                chef.setPassword(req.getPassword());
                chef.setEmail(req.getEmail());
                chef.setPhone(req.getPhone());
                chef.setExperience(req.getExperience());
                chef.setRole("chef");
                chef.setApproved(false);
                return chefRepo.save(chef);
            }
            case "admin" -> {
                Admin admin = new Admin();
                admin.setFullName(req.getFullName());
                admin.setUsername(req.getUsername());
                admin.setPassword(req.getPassword());
                admin.setEmail(req.getEmail());
                admin.setPhone(req.getPhone());
                admin.setRole("admin");
                return adminRepo.save(admin);
            }
            default -> throw new IllegalArgumentException("Invalid role: " + req.getRole());
        }
    }

    //LOGIN
    public Map<String, Object> loginUser(LoginRequest req) {
        String username = req.getUsername();
        String password = req.getPassword();

        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepo.findByUsername(username);
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(password)) {
            response.put("user", adminOpt.get());
            response.put("role", "admin");
            return response;
        }

        Optional<Chef> chefOpt = chefRepo.findByUsername(username);
        if (chefOpt.isPresent()) {
            Chef chef = chefOpt.get();
            if (!chef.getPassword().equals(password))
                throw new IllegalArgumentException("Incorrect password!");
            if (!chef.isApproved())
                throw new IllegalArgumentException("Your chef account is pending admin approval.");
            response.put("user", chef);
            response.put("role", "chef");
            return response;
        }

        Optional<User> userOpt = userRepo.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            response.put("user", userOpt.get());
            response.put("role", "user");
            return response;
        }

        throw new IllegalArgumentException("Invalid username or password!");
    }

    //Approve Chef
    public boolean approveChef(Long id) {
        Optional<Chef> chefOpt = chefRepo.findById(id);
        if (chefOpt.isPresent()) {
            Chef chef = chefOpt.get();
            if (!chef.isApproved()) {
                chef.setApproved(true);
                chefRepo.save(chef);
                return true;
            }
        }
        return false;
    }
}
