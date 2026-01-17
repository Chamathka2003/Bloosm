package com.bloosm.flowerShop.service;

import com.bloosm.flowerShop.entity.*;
import com.bloosm.flowerShop.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AchievementService {
    
    @Autowired
    private AchievementRepository achievementRepository;
    
    @Autowired
    private CustomerAchievementRepository customerAchievementRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    // Initialize GitHub-style achievements when application starts
    public void initializeGitHubStyleAchievements() {
        if (achievementRepository.count() > 0) {
            return; // Already initialized
        }
        
        createPurchaseAchievements();
        createLoyaltyAchievements();
        createMilestoneAchievements();
        createSpecialAchievements();
    }
    
    private void createPurchaseAchievements() {
        // First Purchase - Welcome Badge
        Achievement firstPurchase = new Achievement();
        firstPurchase.setAchievementKey("first-purchase");
        firstPurchase.setTitle("🌸 First Bloom");
        firstPurchase.setDescription("Welcome to Bloosm! You made your first flower purchase.");
        firstPurchase.setBadgeIcon("🌸");
        firstPurchase.setBadgeColor("#FF69B4");
        firstPurchase.setType(Achievement.AchievementType.PURCHASE);
        firstPurchase.setLevel(Achievement.BadgeLevel.BRONZE);
        firstPurchase.setPointsReward(100);
        firstPurchase.setTargetValue(1);
        achievementRepository.save(firstPurchase);
        
        // Big Spender
        Achievement bigSpender = new Achievement();
        bigSpender.setAchievementKey("big-spender");
        bigSpender.setTitle("💎 Big Spender");
        bigSpender.setDescription("Spent $500 or more in a single order!");
        bigSpender.setBadgeIcon("💎");
        bigSpender.setBadgeColor("#4169E1");
        bigSpender.setType(Achievement.AchievementType.PURCHASE);
        bigSpender.setLevel(Achievement.BadgeLevel.GOLD);
        bigSpender.setPointsReward(500);
        bigSpender.setTargetValue(1);
        achievementRepository.save(bigSpender);
        
        // Bulk Buyer
        Achievement bulkBuyer = new Achievement();
        bulkBuyer.setAchievementKey("bulk-buyer");
        bulkBuyer.setTitle("📦 Bulk Buyer");
        bulkBuyer.setDescription("Purchased 50 or more flowers in a single order!");
        bulkBuyer.setBadgeIcon("📦");
        bulkBuyer.setBadgeColor("#32CD32");
        bulkBuyer.setType(Achievement.AchievementType.PURCHASE);
        bulkBuyer.setLevel(Achievement.BadgeLevel.SILVER);
        bulkBuyer.setPointsReward(300);
        bulkBuyer.setTargetValue(1);
        achievementRepository.save(bulkBuyer);
    }
    
    private void createLoyaltyAchievements() {
        // Regular Customer
        Achievement regularCustomer = new Achievement();
        regularCustomer.setAchievementKey("regular-customer");
        regularCustomer.setTitle("🔄 Regular Customer");
        regularCustomer.setDescription("Made 5 purchases. You're becoming a regular!");
        regularCustomer.setBadgeIcon("🔄");
        regularCustomer.setBadgeColor("#FF6347");
        regularCustomer.setType(Achievement.AchievementType.LOYALTY);
        regularCustomer.setLevel(Achievement.BadgeLevel.BRONZE);
        regularCustomer.setPointsReward(250);
        regularCustomer.setTargetValue(5);
        achievementRepository.save(regularCustomer);
        
        // Loyal Customer
        Achievement loyalCustomer = new Achievement();
        loyalCustomer.setAchievementKey("loyal-customer");
        loyalCustomer.setTitle("❤️ Loyal Customer");
        loyalCustomer.setDescription("Made 15 purchases. Your loyalty means everything!");
        loyalCustomer.setBadgeIcon("❤️");
        loyalCustomer.setBadgeColor("#DC143C");
        loyalCustomer.setType(Achievement.AchievementType.LOYALTY);
        loyalCustomer.setLevel(Achievement.BadgeLevel.SILVER);
        loyalCustomer.setPointsReward(750);
        loyalCustomer.setTargetValue(15);
        achievementRepository.save(loyalCustomer);
        
        // VIP Customer
        Achievement vipCustomer = new Achievement();
        vipCustomer.setAchievementKey("vip-customer");
        vipCustomer.setTitle("👑 VIP Customer");
        vipCustomer.setDescription("Made 50 purchases. Welcome to our VIP club!");
        vipCustomer.setBadgeIcon("👑");
        vipCustomer.setBadgeColor("#FFD700");
        vipCustomer.setType(Achievement.AchievementType.LOYALTY);
        vipCustomer.setLevel(Achievement.BadgeLevel.GOLD);
        vipCustomer.setPointsReward(2000);
        vipCustomer.setTargetValue(50);
        achievementRepository.save(vipCustomer);
        
        // Flower Legend
        Achievement flowerLegend = new Achievement();
        flowerLegend.setAchievementKey("flower-legend");
        flowerLegend.setTitle("🏆 Flower Legend");
        flowerLegend.setDescription("Made 100 purchases. You are a true flower legend!");
        flowerLegend.setBadgeIcon("🏆");
        flowerLegend.setBadgeColor("#8A2BE2");
        flowerLegend.setType(Achievement.AchievementType.LOYALTY);
        flowerLegend.setLevel(Achievement.BadgeLevel.PLATINUM);
        flowerLegend.setPointsReward(5000);
        flowerLegend.setTargetValue(100);
        achievementRepository.save(flowerLegend);
    }
    
    private void createMilestoneAchievements() {
        // Early Adopter
        Achievement earlyAdopter = new Achievement();
        earlyAdopter.setAchievementKey("early-adopter");
        earlyAdopter.setTitle("⭐ Early Adopter");
        earlyAdopter.setDescription("One of our first 100 customers!");
        earlyAdopter.setBadgeIcon("⭐");
        earlyAdopter.setBadgeColor("#FFD700");
        earlyAdopter.setType(Achievement.AchievementType.MILESTONE);
        earlyAdopter.setLevel(Achievement.BadgeLevel.GOLD);
        earlyAdopter.setPointsReward(1000);
        earlyAdopter.setTargetValue(1);
        achievementRepository.save(earlyAdopter);
        
        // Speed Buyer
        Achievement speedBuyer = new Achievement();
        speedBuyer.setAchievementKey("speed-buyer");
        speedBuyer.setTitle("⚡ Speed Buyer");
        speedBuyer.setDescription("Made a purchase within 24 hours of registration!");
        speedBuyer.setBadgeIcon("⚡");
        speedBuyer.setBadgeColor("#FFA500");
        speedBuyer.setType(Achievement.AchievementType.MILESTONE);
        speedBuyer.setLevel(Achievement.BadgeLevel.SILVER);
        speedBuyer.setPointsReward(200);
        speedBuyer.setTargetValue(1);
        achievementRepository.save(speedBuyer);
    }
    
    private void createSpecialAchievements() {
        // Valentine's Special
        Achievement valentineSpecial = new Achievement();
        valentineSpecial.setAchievementKey("valentine-special");
        valentineSpecial.setTitle("💕 Valentine's Special");
        valentineSpecial.setDescription("Made a purchase during Valentine's week!");
        valentineSpecial.setBadgeIcon("💕");
        valentineSpecial.setBadgeColor("#FF1493");
        valentineSpecial.setType(Achievement.AchievementType.SEASONAL);
        valentineSpecial.setLevel(Achievement.BadgeLevel.SILVER);
        valentineSpecial.setPointsReward(300);
        valentineSpecial.setTargetValue(1);
        achievementRepository.save(valentineSpecial);
        
        // Perfect Score
        Achievement perfectScore = new Achievement();
        perfectScore.setAchievementKey("perfect-score");
        perfectScore.setTitle("🌟 Perfect Score");
        perfectScore.setDescription("Completed your profile and made a purchase!");
        perfectScore.setBadgeIcon("🌟");
        perfectScore.setBadgeColor("#9932CC");
        perfectScore.setType(Achievement.AchievementType.SPECIAL);
        perfectScore.setLevel(Achievement.BadgeLevel.SILVER);
        perfectScore.setPointsReward(150);
        perfectScore.setTargetValue(1);
        achievementRepository.save(perfectScore);
    }
    
    // Check achievements when a new order is placed
    public void checkOrderAchievements(Customer customer, Order order) {
        checkFirstPurchase(customer);
        checkBigSpender(customer, order);
        checkBulkBuyer(customer, order);
        checkLoyaltyAchievements(customer);
        checkSpeedBuyer(customer);
        checkValentineSpecial(customer, order);
        checkPerfectScore(customer);
    }
    
    // Check achievements when customer registers
    public void checkRegistrationAchievements(Customer customer) {
        checkEarlyAdopter(customer);
    }
    
    private void checkFirstPurchase(Customer customer) {
        updateAchievementProgress(customer, "first-purchase", 1);
    }
    
    private void checkBigSpender(Customer customer, Order order) {
        if (order.getTotalAmount().compareTo(new BigDecimal("500")) >= 0) {
            updateAchievementProgress(customer, "big-spender", 1);
        }
    }
    
    private void checkBulkBuyer(Customer customer, Order order) {
        int totalQuantity = order.getOrderItems().stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();
        if (totalQuantity >= 50) {
            updateAchievementProgress(customer, "bulk-buyer", 1);
        }
    }
    
    private void checkLoyaltyAchievements(Customer customer) {
        long orderCount = orderRepository.countByCustomer(customer);
        updateAchievementProgress(customer, "regular-customer", (int) orderCount);
        updateAchievementProgress(customer, "loyal-customer", (int) orderCount);
        updateAchievementProgress(customer, "vip-customer", (int) orderCount);
        updateAchievementProgress(customer, "flower-legend", (int) orderCount);
    }
    
    private void checkSpeedBuyer(Customer customer) {
        List<Order> orders = orderRepository.findByCustomer(customer);
        if (!orders.isEmpty()) {
            Order firstOrder = orders.get(0);
            LocalDateTime regDate = customer.getRegisteredDate();
            LocalDateTime orderDate = firstOrder.getOrderDate();
            
            if (orderDate.isBefore(regDate.plusDays(1))) {
                updateAchievementProgress(customer, "speed-buyer", 1);
            }
        }
    }
    
    private void checkEarlyAdopter(Customer customer) {
        long totalCustomers = customerRepository.count();
        if (totalCustomers <= 100) {
            updateAchievementProgress(customer, "early-adopter", 1);
        }
    }
    
    private void checkValentineSpecial(Customer customer, Order order) {
        LocalDateTime orderDate = order.getOrderDate();
        int month = orderDate.getMonthValue();
        int day = orderDate.getDayOfMonth();
        
        // Valentine's week: Feb 10-17
        if (month == 2 && day >= 10 && day <= 17) {
            updateAchievementProgress(customer, "valentine-special", 1);
        }
    }
    
    private void checkPerfectScore(Customer customer) {
        // Check if customer has complete profile and at least one order
        boolean hasCompleteProfile = customer.getName() != null && 
                                   customer.getEmail() != null && 
                                   customer.getPhone() != null && 
                                   customer.getAddress() != null;
        
        if (hasCompleteProfile && orderRepository.countByCustomer(customer) > 0) {
            updateAchievementProgress(customer, "perfect-score", 1);
        }
    }
    
    private void updateAchievementProgress(Customer customer, String achievementKey, int progress) {
        Optional<Achievement> achievementOpt = achievementRepository.findByAchievementKey(achievementKey);
        if (achievementOpt.isEmpty()) return;
        
        Achievement achievement = achievementOpt.get();
        Optional<CustomerAchievement> customerAchievementOpt = 
            customerAchievementRepository.findByCustomerAndAchievement(customer, achievement);
        
        CustomerAchievement customerAchievement;
        if (customerAchievementOpt.isEmpty()) {
            customerAchievement = new CustomerAchievement(customer, achievement);
        } else {
            customerAchievement = customerAchievementOpt.get();
        }
        
        customerAchievement.updateProgress(progress);
        customerAchievementRepository.save(customerAchievement);
    }
    
    // Public methods for controllers
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAllActiveOrderedByDifficulty();
    }
    
    public List<CustomerAchievement> getCustomerAchievements(Customer customer) {
        return customerAchievementRepository.findByCustomer(customer);
    }
    
    public List<CustomerAchievement> getCustomerUnlockedAchievements(Customer customer) {
        return customerAchievementRepository.findByCustomerAndIsUnlockedTrue(customer);
    }
    
    public Integer getCustomerTotalPoints(Customer customer) {
        return customerAchievementRepository.getTotalPointsByCustomer(customer);
    }
    
    public Map<String, Object> getCustomerAchievementStats(Customer customer) {
        Map<String, Object> stats = new HashMap<>();
        Long unlockedCount = customerAchievementRepository.countUnlockedAchievementsByCustomer(customer);
        Integer totalPoints = getCustomerTotalPoints(customer);
        Long totalAchievements = achievementRepository.count();
        List<CustomerAchievement> recentAchievements = 
            customerAchievementRepository.findRecentUnlockedAchievements(customer);
        
        stats.put("unlockedCount", unlockedCount);
        stats.put("totalPoints", totalPoints);
        stats.put("totalAchievements", totalAchievements);
        stats.put("recentAchievements", recentAchievements);
        stats.put("completionPercentage", totalAchievements > 0 ? (unlockedCount * 100.0 / totalAchievements) : 0);
        
        return stats;
    }
}