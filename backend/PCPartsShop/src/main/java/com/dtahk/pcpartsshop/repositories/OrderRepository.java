package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.dtos.OrderCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.OrderCustomerResponseDto;
import com.dtahk.pcpartsshop.dtos.OrderResponseDto;
import com.dtahk.pcpartsshop.entites.Order;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByCustomerId(Long id);

}
