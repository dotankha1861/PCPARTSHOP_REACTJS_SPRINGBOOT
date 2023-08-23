package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.CartItem;
import com.dtahk.pcpartsshop.entites.CartItemKey;
import com.dtahk.pcpartsshop.entites.Customer;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<CartItem, CartItemKey> {
    List<CartItem> findAllByCustomer(Customer customer);
    void deleteAllByCustomerId(Long customerId);
}
