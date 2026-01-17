package com.bloosm.flowerShop.repository;

import com.bloosm.flowerShop.entity.Customer;
import com.bloosm.flowerShop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByCustomer(Customer customer);
    List<Order> findByStatus(String status);
    Long countByCustomer(Customer customer);
}
