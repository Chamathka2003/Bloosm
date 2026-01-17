package com.bloosm.flowerShop.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_achievements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerAchievement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;
    
    private LocalDateTime unlockedDate = LocalDateTime.now();
    
    private Integer currentProgress = 0; // Current progress towards achievement
    
    private boolean isUnlocked = false; // Whether the achievement is unlocked
    
    private String notes; // Additional context about how it was earned
    
    // Constructor for creating new achievement tracking
    public CustomerAchievement(Customer customer, Achievement achievement) {
        this.customer = customer;
        this.achievement = achievement;
        this.currentProgress = 0;
        this.isUnlocked = false;
    }
    
    // Method to update progress
    public void updateProgress(Integer progress) {
        this.currentProgress = progress;
        if (progress >= achievement.getTargetValue() && !this.isUnlocked) {
            this.isUnlocked = true;
            this.unlockedDate = LocalDateTime.now();
        }
    }
}