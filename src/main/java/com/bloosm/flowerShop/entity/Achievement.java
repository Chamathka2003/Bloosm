package com.bloosm.flowerShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String achievementKey; // Unique identifier like "first-purchase", "loyal-customer"
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private String badgeIcon; // Font Awesome icon class or emoji
    
    @Column(nullable = false)
    private String badgeColor; // CSS color for the badge
    
    private Integer pointsReward = 0;
    
    @Enumerated(EnumType.STRING)
    private AchievementType type;
    
    @Enumerated(EnumType.STRING)
    private BadgeLevel level;
    
    private Integer targetValue = 1; // Target number to achieve (e.g., 5 for "5 purchases")
    
    private boolean active = true;
    
    public enum AchievementType {
        PURCHASE,      // Order-related achievements
        LOYALTY,       // Customer loyalty achievements
        MILESTONE,     // Special milestones
        SEASONAL,      // Seasonal achievements
        SOCIAL,        // Social/sharing achievements
        SPECIAL        // Limited time/special events
    }
    
    public enum BadgeLevel {
        BRONZE,        // Easy to achieve
        SILVER,        // Medium difficulty
        GOLD,          // Hard to achieve
        PLATINUM,      // Very rare achievements
        DIAMOND        // Ultra rare achievements
    }
}