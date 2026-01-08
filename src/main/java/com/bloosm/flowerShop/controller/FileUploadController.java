package com.bloosm.flowerShop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {
    
    private static final String UPLOAD_DIR = "target/classes/static/images/uploads/";
    private static final String SOURCE_UPLOAD_DIR = "src/main/resources/static/images/uploads/";
    
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        if (file.isEmpty()) {
            response.put("error", "Please select a file");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Create upload directories if they don't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Path sourceUploadPath = Paths.get(SOURCE_UPLOAD_DIR);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            if (!Files.exists(sourceUploadPath)) {
                Files.createDirectories(sourceUploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // Save file to both locations
            Path targetFilePath = uploadPath.resolve(newFilename);
            Path sourceFilePath = sourceUploadPath.resolve(newFilename);
            
            Files.copy(file.getInputStream(), targetFilePath, StandardCopyOption.REPLACE_EXISTING);
            Files.copy(Files.newInputStream(targetFilePath), sourceFilePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return the URL path
            String imageUrl = "images/uploads/" + newFilename;
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            response.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
