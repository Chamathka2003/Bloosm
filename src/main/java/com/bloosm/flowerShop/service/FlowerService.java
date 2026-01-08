package com.bloosm.flowerShop.service;

import com.bloosm.flowerShop.entity.Flower;
import com.bloosm.flowerShop.repository.FlowerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlowerService {
    
    @Autowired
    private FlowerRepository flowerRepository;
    
    public List<Flower> getAllFlowers() {
        return flowerRepository.findAll();
    }
    
    public List<Flower> getAvailableFlowers() {
        return flowerRepository.findByAvailableTrue();
    }
    
    public Optional<Flower> getFlowerById(Long id) {
        return flowerRepository.findById(id);
    }
    
    public List<Flower> getFlowersByCategory(String category) {
        return flowerRepository.findByCategory(category);
    }
    
    public List<Flower> searchFlowers(String keyword) {
        return flowerRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public Flower saveFlower(Flower flower) {
        return flowerRepository.save(flower);
    }
    
    public void deleteFlower(Long id) {
        flowerRepository.deleteById(id);
    }
    
    public Flower updateFlower(Long id, Flower flowerDetails) {
        Flower flower = flowerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flower not found"));
        
        flower.setName(flowerDetails.getName());
        flower.setDescription(flowerDetails.getDescription());
        flower.setPrice(flowerDetails.getPrice());
        flower.setStockQuantity(flowerDetails.getStockQuantity());
        flower.setImageUrl(flowerDetails.getImageUrl());
        flower.setCategory(flowerDetails.getCategory());
        flower.setColor(flowerDetails.getColor());
        flower.setAvailable(flowerDetails.getAvailable());
        
        return flowerRepository.save(flower);
    }
}
