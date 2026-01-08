package com.bloosm.flowerShop.service;

import com.bloosm.flowerShop.entity.Customer;
import com.bloosm.flowerShop.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    
    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }
    
    public Customer saveCustomer(Customer customer) {
        // Allow setting custom ID if provided, otherwise auto-generate
        if (customer.getId() != null) {
            // Check if customer with this ID already exists
            if (customerRepository.existsById(customer.getId())) {
                // Update existing customer
                return customerRepository.save(customer);
            }
        }
        
        // For new customers, check email uniqueness
        if (customer.getEmail() != null && !customer.getEmail().isEmpty()) {
            if (customerRepository.existsByEmail(customer.getEmail())) {
                throw new RuntimeException("Customer with this email already exists");
            }
        }
        return customerRepository.save(customer);
    }
    
    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setName(customerDetails.getName());
        customer.setPhone(customerDetails.getPhone());
        customer.setAddress(customerDetails.getAddress());
        
        return customerRepository.save(customer);
    }
    
    public Customer getOrCreateCustomer(Long userId, String defaultName, String defaultEmail) {
        // IMPORTANT: Always try to find by ID first, then create if needed
        // We no longer use generated emails, frontend sends actual user emails
        
        // First, try to find by ID
        Optional<Customer> existingById = customerRepository.findById(userId);
        if (existingById.isPresent()) {
            return existingById.get();
        }
        
        // If not found by ID, create new customer
        // Use guest email for guest user, otherwise empty (frontend will provide actual email)
        String email = (userId == 1L) ? "guest@bloosm.com" : defaultEmail;
        
        Customer newCustomer = new Customer();
        newCustomer.setId(userId);
        newCustomer.setName(defaultName);
        newCustomer.setEmail(email);
        newCustomer.setPhone("");
        newCustomer.setAddress("");
        
        return customerRepository.save(newCustomer);
    }
    
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
