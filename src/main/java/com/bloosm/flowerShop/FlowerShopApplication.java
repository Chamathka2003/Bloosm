package com.bloosm.flowerShop;

import com.bloosm.flowerShop.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FlowerShopApplication implements CommandLineRunner {
    
    @Autowired
    private AchievementService achievementService;
    
    public static void main(String[] args) {
        SpringApplication.run(FlowerShopApplication.class, args);
        System.out.println("🌸 Bloosm Flower Shop is running on http://localhost:8080");
    }
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize GitHub-style achievements on startup
        achievementService.initializeGitHubStyleAchievements();
        System.out.println("🏆 GitHub-style achievements initialized!");
    }
}
