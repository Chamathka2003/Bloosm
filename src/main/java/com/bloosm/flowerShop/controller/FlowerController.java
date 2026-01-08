package com.bloosm.flowerShop.controller;

import com.bloosm.flowerShop.entity.Flower;
import com.bloosm.flowerShop.service.FlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flowers")
@CrossOrigin(origins = "*")
public class FlowerController {
    
    @Autowired
    private FlowerService flowerService;
    
    @GetMapping
    public List<Flower> getAllFlowers() {
        return flowerService.getAllFlowers();
    }
    
    @GetMapping("/available")
    public List<Flower> getAvailableFlowers() {
        return flowerService.getAvailableFlowers();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Flower> getFlowerById(@PathVariable Long id) {
        return flowerService.getFlowerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public List<Flower> getFlowersByCategory(@PathVariable String category) {
        return flowerService.getFlowersByCategory(category);
    }
    
    @GetMapping("/search")
    public List<Flower> searchFlowers(@RequestParam String keyword) {
        return flowerService.searchFlowers(keyword);
    }
    
    @PostMapping
    public Flower createFlower(@RequestBody Flower flower) {
        return flowerService.saveFlower(flower);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Flower> updateFlower(@PathVariable Long id, @RequestBody Flower flower) {
        try {
            Flower updatedFlower = flowerService.updateFlower(id, flower);
            return ResponseEntity.ok(updatedFlower);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlower(@PathVariable Long id) {
        flowerService.deleteFlower(id);
        return ResponseEntity.ok().build();
    }
}
