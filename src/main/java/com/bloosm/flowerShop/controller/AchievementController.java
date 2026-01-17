package com.bloosm.flowerShop.controller;

import com.bloosm.flowerShop.entity.Achievement;
import com.bloosm.flowerShop.entity.Customer;
import com.bloosm.flowerShop.entity.CustomerAchievement;
import com.bloosm.flowerShop.service.AchievementService;
import com.bloosm.flowerShop.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "*")
public class AchievementController {
    
    @Autowired
    private AchievementService achievementService;
    
    @Autowired
    private CustomerService customerService;
    
    // Initialize GitHub-style achievements
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, Object>> initializeAchievements() {
        try {
            achievementService.initializeGitHubStyleAchievements();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "GitHub-style achievements initialized successfully!");
            response.put("achievementsCount", achievementService.getAllAchievements().size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to initialize achievements: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Get all available achievements with GitHub-style display
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllAchievements() {
        try {
            List<Achievement> achievements = achievementService.getAllAchievements();
            Map<String, Object> response = new HashMap<>();
            response.put("achievements", achievements);
            response.put("totalCount", achievements.size());
            response.put("categories", Achievement.AchievementType.values());
            response.put("levels", Achievement.BadgeLevel.values());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch achievements: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Get customer's achievement dashboard (GitHub profile style)
    @GetMapping("/customer/{customerId}/dashboard")
    public ResponseEntity<Map<String, Object>> getCustomerDashboard(@PathVariable Long customerId) {
        try {
            Customer customer = customerService.getCustomerById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            Map<String, Object> dashboard = achievementService.getCustomerAchievementStats(customer);
            List<CustomerAchievement> allProgress = achievementService.getCustomerAchievements(customer);
            List<CustomerAchievement> unlockedAchievements = achievementService.getCustomerUnlockedAchievements(customer);
            List<Achievement> allAchievements = achievementService.getAllAchievements();
            
            dashboard.put("customer", customer);
            dashboard.put("allProgress", allProgress);
            dashboard.put("unlockedAchievements", unlockedAchievements);
            dashboard.put("allAchievements", allAchievements);
            dashboard.put("success", true);
            
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to load customer dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Get customer's unlocked achievements only
    @GetMapping("/customer/{customerId}/unlocked")
    public ResponseEntity<Map<String, Object>> getCustomerUnlockedAchievements(@PathVariable Long customerId) {
        try {
            Customer customer = customerService.getCustomerById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            List<CustomerAchievement> unlockedAchievements = achievementService.getCustomerUnlockedAchievements(customer);
            Integer totalPoints = achievementService.getCustomerTotalPoints(customer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("unlockedAchievements", unlockedAchievements);
            response.put("totalPoints", totalPoints);
            response.put("count", unlockedAchievements.size());
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch unlocked achievements: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Get customer's achievement progress (including partial progress)
    @GetMapping("/customer/{customerId}/progress")
    public ResponseEntity<Map<String, Object>> getCustomerProgress(@PathVariable Long customerId) {
        try {
            Customer customer = customerService.getCustomerById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            List<CustomerAchievement> allProgress = achievementService.getCustomerAchievements(customer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("progressList", allProgress);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch achievement progress: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Manually trigger achievement check for a customer (admin/testing)
    @PostMapping("/customer/{customerId}/check")
    public ResponseEntity<Map<String, Object>> checkCustomerAchievements(@PathVariable Long customerId) {
        try {
            Customer customer = customerService.getCustomerById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
            
            // Check registration achievements
            achievementService.checkRegistrationAchievements(customer);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Achievement check completed for customer: " + customer.getName());
            response.put("newlyUnlocked", achievementService.getCustomerUnlockedAchievements(customer).size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Achievement check failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Get achievements by category
    @GetMapping("/category/{type}")
    public ResponseEntity<Map<String, Object>> getAchievementsByCategory(@PathVariable String type) {
        try {
            Achievement.AchievementType achievementType = Achievement.AchievementType.valueOf(type.toUpperCase());
            List<Achievement> achievements = achievementService.getAllAchievements().stream()
                .filter(a -> a.getType() == achievementType)
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("achievements", achievements);
            response.put("category", achievementType);
            response.put("count", achievements.size());
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch achievements by category: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}