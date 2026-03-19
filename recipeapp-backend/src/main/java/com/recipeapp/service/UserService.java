package com.recipeapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recipeapp.entity.User;
import com.recipeapp.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    //Get all users (admin use)
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    //Get single user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepo.findByUsername(username);
    }

    //Update user profile (username, password, email, phone)
    public User updateUser(Long id, User updatedUser) {
        return userRepo.findById(id).map(existingUser -> {
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(updatedUser.getPassword()); // plain text
            }

            return userRepo.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    //Delete own account
    public String deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepo.deleteById(id);
        return "User account deleted successfully.";
    }
}
