package com.recipeapp.service;

import com.recipeapp.entity.Admin;
import com.recipeapp.entity.Chef;
import com.recipeapp.entity.User;
import com.recipeapp.repository.AdminRepository;
import com.recipeapp.repository.ChefRepository;
import com.recipeapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ChefRepository chefRepo;

    @Autowired
    private AdminRepository adminRepo;
    
    private static final String UPLOAD_DIR = System.getProperty("user.dir") 
            + File.separator + "uploads" 
            + File.separator + "profilePics" 
            + File.separator;

    public String saveProfilePicture(MultipartFile file, String username) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                boolean created = dir.mkdirs();
                System.out.println("Created upload directory: " + created + " at " + dir.getAbsolutePath());
            }

            String originalFilename = Optional.ofNullable(file.getOriginalFilename()).orElse("image.jpg");
            String ext = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".jpg";

            String filename = username + "_" + UUID.randomUUID() + ext;
            File destination = new File(dir, filename);

            System.out.println("Saving file to: " + destination.getAbsolutePath());

            file.transferTo(destination);
            
            return "/uploads/profilePics/" + filename;

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("❌ Failed to upload profile picture: " + e.getMessage());
        }
    }

    public Object getProfile(String role, String username) {
        return switch (role.toLowerCase()) {
            case "user" -> userRepo.findByUsername(username).orElse(null);
            case "chef" -> chefRepo.findByUsername(username).orElse(null);
            case "admin" -> adminRepo.findByUsername(username).orElse(null);
            default -> null;
        };
    }

    public String updateProfile(String role, String username, Map<String, String> updates) {
        switch (role.toLowerCase()) {
            case "user" -> {
                Optional<User> opt = userRepo.findByUsername(username);
                if (opt.isEmpty()) return "User not found";
                User u = opt.get();
                u.setFullName(updates.getOrDefault("fullName", u.getFullName()));
                u.setEmail(updates.getOrDefault("email", u.getEmail()));
                u.setPhone(updates.getOrDefault("phone", u.getPhone()));
                u.setProfilePic(updates.getOrDefault("profilePic", u.getProfilePic()));
                userRepo.save(u);
                return "User profile updated successfully";
            }

            case "chef" -> {
                Optional<Chef> opt = chefRepo.findByUsername(username);
                if (opt.isEmpty()) return "Chef not found";
                Chef c = opt.get();
                c.setFullName(updates.getOrDefault("fullName", c.getFullName()));
                c.setEmail(updates.getOrDefault("email", c.getEmail()));
                c.setPhone(updates.getOrDefault("phone", c.getPhone()));
                c.setExperience(updates.getOrDefault("experience", c.getExperience()));
                c.setProfilePic(updates.getOrDefault("profilePic", c.getProfilePic()));
                chefRepo.save(c);
                return "Chef profile updated successfully";
            }

            case "admin" -> {
                Optional<Admin> opt = adminRepo.findByUsername(username);
                if (opt.isEmpty()) return "Admin not found";
                Admin a = opt.get();
                a.setFullName(updates.getOrDefault("fullName", a.getFullName()));
                a.setEmail(updates.getOrDefault("email", a.getEmail()));
                a.setPhone(updates.getOrDefault("phone", a.getPhone()));
                a.setProfilePic(updates.getOrDefault("profilePic", a.getProfilePic()));
                adminRepo.save(a);
                return "Admin profile updated successfully";
            }

            default -> {
                return "Invalid role specified";
            }
        }
    }

    public String changePassword(String role, String username, String oldPassword, String newPassword) {
        switch (role.toLowerCase()) {
            case "user" -> {
                User u = userRepo.findByUsername(username).orElse(null);
                if (u == null) return "User not found";
                if (!u.getPassword().equals(oldPassword)) return "Old password incorrect";
                u.setPassword(newPassword);
                userRepo.save(u);
                return "Password updated successfully";
            }

            case "chef" -> {
                Chef c = chefRepo.findByUsername(username).orElse(null);
                if (c == null) return "Chef not found";
                if (!c.getPassword().equals(oldPassword)) return "Old password incorrect";
                c.setPassword(newPassword);
                chefRepo.save(c);
                return "Password updated successfully";
            }

            case "admin" -> {
                Admin a = adminRepo.findByUsername(username).orElse(null);
                if (a == null) return "Admin not found";
                if (!a.getPassword().equals(oldPassword)) return "Old password incorrect";
                a.setPassword(newPassword);
                adminRepo.save(a);
                return "Password updated successfully";
            }

            default -> {
                return "Invalid role";
            }
        }
    }
}
