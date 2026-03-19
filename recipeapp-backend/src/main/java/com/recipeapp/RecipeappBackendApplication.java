package com.recipeapp;

import com.recipeapp.entity.Admin;
import com.recipeapp.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class RecipeappBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecipeappBackendApplication.class, args);
        System.out.println("Backend is running...");    }

    @Bean
    public CommandLineRunner seedAdmin(AdminRepository adminRepo) {
        return args -> {
            if (adminRepo.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setFullName("Administrator");
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setPhone("0000000000");
                admin.setEmail("admin@example.com");
                adminRepo.save(admin);
                System.out.println("Default admin created: admin / admin123");
            }
        };
    }
}
