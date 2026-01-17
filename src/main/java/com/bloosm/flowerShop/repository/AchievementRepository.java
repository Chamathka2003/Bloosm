package com.bloosm.flowerShop.repository;

import com.bloosm.flowerShop.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    
    Optional<Achievement> findByAchievementKey(String achievementKey);
    
    List<Achievement> findByActiveTrue();
    
    List<Achievement> findByType(Achievement.AchievementType type);
    
    List<Achievement> findByLevel(Achievement.BadgeLevel level);
    
    @Query("SELECT a FROM Achievement a WHERE a.active = true ORDER BY a.level, a.pointsReward")
    List<Achievement> findAllActiveOrderedByDifficulty();
}