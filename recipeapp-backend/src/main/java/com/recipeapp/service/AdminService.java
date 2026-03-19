package com.recipeapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.recipeapp.entity.*;
import com.recipeapp.repository.*;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private ChefRepository chefRepo;

    @Autowired
    private UserRepository userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public List<Chef> getAllChefs() {
        return chefRepo.findAll();
    }

    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepo.findByUsername(username);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public void deleteChef(Long id) {
        chefRepo.deleteById(id);
    }
}
