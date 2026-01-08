package com.bloosm.flowerShop.repository;

import com.bloosm.flowerShop.entity.Flower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlowerRepository extends JpaRepository<Flower, Long> {
    List<Flower> findByCategory(String category);
    List<Flower> findByAvailableTrue();
    List<Flower> findByNameContainingIgnoreCase(String name);
}
