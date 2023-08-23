package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.OrderDetailDto;
import com.dtahk.pcpartsshop.dtos.StatisticRevenueResponseDto;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import com.dtahk.pcpartsshop.repositories.OrderDetailRepository;
import com.dtahk.pcpartsshop.services.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    @Override
    public OrderDetail save(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public List<OrderDetail> getAllByOrderId(Long id) {
        return orderDetailRepository.getAllByOrderId(id);
    }

    @Override
    public boolean checkProductAlreadyOrder(Long productId) {
        return orderDetailRepository.existsByProductId(productId);
    }

    @Override
    public List<StatisticRevenueResponseDto> statisticRevenue(Date dateFrom, Date dateTo) {
        return orderDetailRepository.getStatisticRevenue(dateFrom, dateTo);
    }

//    @Override
//    public void deleteAllByProductId(Long productId) {
//        orderDetailRepository.deleteAllByProductId(productId);
//    }
}
