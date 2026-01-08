package com.bloosm.flowerShop.repository;

import com.bloosm.flowerShop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCustomerId(Long customerId);
    Optional<CartItem> findByCustomerIdAndFlowerId(Long customerId, Long flowerId);
    void deleteByCustomerId(Long customerId);
}
