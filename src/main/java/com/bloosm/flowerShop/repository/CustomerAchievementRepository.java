package com.bloosm.flowerShop.repository;

import com.bloosm.flowerShop.entity.Achievement;
import com.bloosm.flowerShop.entity.Customer;
import com.bloosm.flowerShop.entity.CustomerAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerAchievementRepository extends JpaRepository<CustomerAchievement, Long> {
    
    // Find all achievements for a customer (both unlocked and in progress)
    List<CustomerAchievement> findByCustomer(Customer customer);
    
    // Find only unlocked achievements for a customer
    List<CustomerAchievement> findByCustomerAndIsUnlockedTrue(Customer customer);
    
    // Find specific achievement for a customer
    Optional<CustomerAchievement> findByCustomerAndAchievement(Customer customer, Achievement achievement);
    
    // Count total unlocked achievements for a customer
    @Query("SELECT COUNT(ca) FROM CustomerAchievement ca WHERE ca.customer = :customer AND ca.isUnlocked = true")
    Long countUnlockedAchievementsByCustomer(@Param("customer") Customer customer);
    
    // Calculate total points earned by a customer
    @Query("SELECT COALESCE(SUM(a.pointsReward), 0) FROM CustomerAchievement ca JOIN ca.achievement a WHERE ca.customer = :customer AND ca.isUnlocked = true")
    Integer getTotalPointsByCustomer(@Param("customer") Customer customer);
    
    // Find achievements in progress (not unlocked but has some progress)
    List<CustomerAchievement> findByCustomerAndIsUnlockedFalseAndCurrentProgressGreaterThan(Customer customer, Integer progress);
    
    // Find recent achievements for a customer
    @Query("SELECT ca FROM CustomerAchievement ca WHERE ca.customer = :customer AND ca.isUnlocked = true ORDER BY ca.unlockedDate DESC")
    List<CustomerAchievement> findRecentUnlockedAchievements(@Param("customer") Customer customer);
}