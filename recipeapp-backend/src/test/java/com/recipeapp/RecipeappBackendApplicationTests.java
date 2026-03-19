package com.recipeapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class RecipeappBackendApplicationTests {

    @Test
    void contextLoads() {
        System.out.println("✅ Spring context loaded successfully for tests");
    }
}
