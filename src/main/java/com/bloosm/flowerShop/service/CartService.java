package com.bloosm.flowerShop.service;

import com.bloosm.flowerShop.entity.CartItem;
import com.bloosm.flowerShop.entity.Customer;
import com.bloosm.flowerShop.entity.Flower;
import com.bloosm.flowerShop.repository.CartItemRepository;
import com.bloosm.flowerShop.repository.CustomerRepository;
import com.bloosm.flowerShop.repository.FlowerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private FlowerRepository flowerRepository;
    
    @Autowired
    private CustomerService customerService;
    
    public List<CartItem> getCartItems(Long customerId) {
        return cartItemRepository.findByCustomerId(customerId);
    }
    
    public CartItem addToCart(Long customerId, Long flowerId, Integer quantity) {
        // Get the customer - must already exist (created during login/signup)
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));
        
        Flower flower = flowerRepository.findById(flowerId)
                .orElseThrow(() -> new RuntimeException("Flower not found"));
        
        if (!flower.getAvailable() || flower.getStockQuantity() < quantity) {
            throw new RuntimeException("Flower not available or insufficient stock");
        }
        
        // Use the actual customer ID from database for checking existing items
        Optional<CartItem> existingItem = cartItemRepository
                .findByCustomerIdAndFlowerId(customer.getId(), flowerId);
        
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCustomer(customer);
            cartItem.setFlower(flower);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(flower.getPrice());
            return cartItemRepository.save(cartItem);
        }
    }
    
    public CartItem updateCartItem(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        cartItem.setQuantity(quantity);
        return cartItemRepository.save(cartItem);
    }
    
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }
    
    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomerId(customerId);
    }
}
