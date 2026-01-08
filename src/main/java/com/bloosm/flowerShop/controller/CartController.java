package com.bloosm.flowerShop.controller;

import com.bloosm.flowerShop.entity.CartItem;
import com.bloosm.flowerShop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping("/{customerId}")
    public List<CartItem> getCartItems(@PathVariable Long customerId) {
        System.out.println("GET CART - Customer ID: " + customerId);
        List<CartItem> items = cartService.getCartItems(customerId);
        System.out.println("GET CART - Found " + items.size() + " items for customer " + customerId);
        return items;
    }
    
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            Long flowerId = Long.valueOf(request.get("flowerId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            
            System.out.println("ADD TO CART - Customer ID: " + customerId + ", Flower ID: " + flowerId);
            
            CartItem cartItem = cartService.addToCart(customerId, flowerId, quantity);
            
            System.out.println("ADD TO CART - Created item with customer ID: " + cartItem.getCustomer().getId());
            
            // Return the cart item with actual customer ID
            return ResponseEntity.ok(Map.of(
                "cartItem", cartItem,
                "customerId", cartItem.getCustomer().getId()
            ));
        } catch (RuntimeException e) {
            System.out.println("ADD TO CART - ERROR: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer quantity = request.get("quantity");
            CartItem updatedItem = cartService.updateCartItem(cartItemId, quantity);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/clear/{customerId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok().build();
    }
}
