//package com.recipeapp.controller;
//
//import com.recipeapp.entity.Admin;
//import com.recipeapp.entity.Chef;
//import com.recipeapp.entity.User;
//import com.recipeapp.repository.AdminRepository;
//import com.recipeapp.repository.ChefRepository;
//import com.recipeapp.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
//@RestController
//@RequestMapping("/api/profile")
//public class ProfileController {
//
//    @Autowired
//    private AdminRepository adminRepo;
//    @Autowired
//    private ChefRepository chefRepo;
//    @Autowired
//    private UserRepository userRepo;
//
//    // ============================================================
//    // 👤 GET PROFILE
//    // ============================================================
//    @GetMapping("/{role}/{username}")
//    public Map<String, Object> getProfile(@PathVariable String role, @PathVariable String username) {
//        Map<String, Object> response = new HashMap<>();
//
//        switch (role.toLowerCase()) {
//            case "admin" -> {
//                Optional<Admin> admin = adminRepo.findByUsername(username);
//                response.put("profile", admin.orElse(null));
//            }
//            case "chef" -> {
//                Optional<Chef> chef = chefRepo.findByUsername(username);
//                response.put("profile", chef.orElse(null));
//            }
//            case "user" -> {
//                Optional<User> user = userRepo.findByUsername(username);
//                response.put("profile", user.orElse(null));
//            }
//            default -> response.put("error", "Invalid role!");
//        }
//        return response;
//    }
//
//    // ============================================================
//    // ✏️ UPDATE PROFILE
//    // ============================================================
//    @PutMapping("/update/{role}/{username}")
//    public Map<String, Object> updateProfile(@PathVariable String role,
//                                             @PathVariable String username,
//                                             @RequestBody Map<String, String> updates) {
//        Map<String, Object> response = new HashMap<>();
//
//        switch (role.toLowerCase()) {
//            case "admin" -> {
//                Optional<Admin> adminOpt = adminRepo.findByUsername(username);
//                if (adminOpt.isPresent()) {
//                    Admin admin = adminOpt.get();
//                    admin.setFullName(updates.getOrDefault("fullName", admin.getFullName()));
//                    admin.setEmail(updates.getOrDefault("email", admin.getEmail()));
//                    adminRepo.save(admin);
//                    response.put("message", "Admin profile updated successfully!");
//                } else response.put("error", "Admin not found!");
//            }
//
//            case "chef" -> {
//                Optional<Chef> chefOpt = chefRepo.findByUsername(username);
//                if (chefOpt.isPresent()) {
//                    Chef chef = chefOpt.get();
//                    chef.setFullName(updates.getOrDefault("fullName", chef.getFullName()));
//                    chef.setEmail(updates.getOrDefault("email", chef.getEmail()));
//                    chef.setPhone(updates.getOrDefault("phone", chef.getPhone()));
//                    chef.setExperience(updates.getOrDefault("experience", chef.getExperience()));
//                    chefRepo.save(chef);
//                    response.put("message", "Chef profile updated successfully!");
//                } else response.put("error", "Chef not found!");
//            }
//
//            case "user" -> {
//                Optional<User> userOpt = userRepo.findByUsername(username);
//                if (userOpt.isPresent()) {
//                    User user = userOpt.get();
//                    user.setFullName(updates.getOrDefault("fullName", user.getFullName()));
//                    user.setEmail(updates.getOrDefault("email", user.getEmail()));
//                    user.setPhone(updates.getOrDefault("phone", user.getPhone()));
//                    userRepo.save(user);
//                    response.put("message", "User profile updated successfully!");
//                } else response.put("error", "User not found!");
//            }
//
//            default -> response.put("error", "Invalid role!");
//        }
//
//        return response;
//    }
//
//    // ============================================================
//    // 🔑 CHANGE PASSWORD
//    // ============================================================
//    @PutMapping("/change-password/{role}/{username}")
//    public Map<String, Object> changePassword(@PathVariable String role,
//                                              @PathVariable String username,
//                                              @RequestBody Map<String, String> body) {
//        Map<String, Object> response = new HashMap<>();
//        String oldPass = body.get("oldPassword");
//        String newPass = body.get("newPassword");
//
//        switch (role.toLowerCase()) {
//            case "admin" -> {
//                Optional<Admin> adminOpt = adminRepo.findByUsername(username);
//                if (adminOpt.isPresent()) {
//                    Admin admin = adminOpt.get();
//                    if (!admin.getPassword().equals(oldPass)) {
//                        response.put("error", "Incorrect old password!");
//                        break;
//                    }
//                    admin.setPassword(newPass);
//                    adminRepo.save(admin);
//                    response.put("message", "Password changed successfully!");
//                } else response.put("error", "Admin not found!");
//            }
//
//            case "chef" -> {
//                Optional<Chef> chefOpt = chefRepo.findByUsername(username);
//                if (chefOpt.isPresent()) {
//                    Chef chef = chefOpt.get();
//                    if (!chef.getPassword().equals(oldPass)) {
//                        response.put("error", "Incorrect old password!");
//                        break;
//                    }
//                    chef.setPassword(newPass);
//                    chefRepo.save(chef);
//                    response.put("message", "Password changed successfully!");
//                } else response.put("error", "Chef not found!");
//            }
//
//            case "user" -> {
//                Optional<User> userOpt = userRepo.findByUsername(username);
//                if (userOpt.isPresent()) {
//                    User user = userOpt.get();
//                    if (!user.getPassword().equals(oldPass)) {
//                        response.put("error", "Incorrect old password!");
//                        break;
//                    }
//                    user.setPassword(newPass);
//                    userRepo.save(user);
//                    response.put("message", "Password changed successfully!");
//                } else response.put("error", "User not found!");
//            }
//
//            default -> response.put("error", "Invalid role!");
//        }
//
//        return response;
//    }
//}

package com.recipeapp.controller;

import com.recipeapp.dto.ApiResponse;
import com.recipeapp.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;
    
    //Get Profile
    @GetMapping("/{role}/{username}")
    public ApiResponse<Object> getProfile(@PathVariable String role, @PathVariable String username) {
        Object profile = profileService.getProfile(role, username);
        if (profile == null)
            return new ApiResponse<>(false, "Profile not found!", null);

        return new ApiResponse<>(true, "Profile fetched successfully!", profile);
    }
    
    //Update Profile
    @PutMapping("/update/{role}/{username}")
    public ApiResponse<String> updateProfile(@PathVariable String role,
                                             @PathVariable String username,
                                             @RequestBody Map<String, String> updates) {
        String msg = profileService.updateProfile(role, username, updates);
        boolean success = !msg.toLowerCase().contains("not found") && !msg.toLowerCase().contains("invalid");
        return new ApiResponse<>(success, msg, null);
    }

    //Change Password
    @PutMapping("/change-password/{role}/{username}")
    public ApiResponse<String> changePassword(@PathVariable String role,
                                              @PathVariable String username,
                                              @RequestBody Map<String, String> body) {
        String msg = profileService.changePassword(
                role,
                username,
                body.get("oldPassword"),
                body.get("newPassword")
        );
        boolean success = msg.toLowerCase().contains("success");
        return new ApiResponse<>(success, msg, null);
    }
    
    //Upload profile pic
    @PostMapping("/upload-picture/{role}/{username}")
    public ApiResponse<String> uploadProfilePicture(@PathVariable String role,
                                                    @PathVariable String username,
                                                    @RequestParam("file") MultipartFile file) {
        if (file.isEmpty())
            return new ApiResponse<>(false, "No file uploaded!", null);

        try {
            String imagePath = profileService.saveProfilePicture(file, username);

            profileService.updateProfile(role, username, Map.of("profilePic", imagePath));

            return new ApiResponse<>(true, "Profile picture uploaded successfully!", imagePath);
        } catch (Exception e) {
            return new ApiResponse<>(false, "Failed to upload picture: " + e.getMessage(), null);
        }
    }
}
