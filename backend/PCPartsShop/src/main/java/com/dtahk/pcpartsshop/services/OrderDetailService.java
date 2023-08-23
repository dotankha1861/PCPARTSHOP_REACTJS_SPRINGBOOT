package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.OrderDetailDto;
import com.dtahk.pcpartsshop.dtos.StatisticRevenueResponseDto;
import com.dtahk.pcpartsshop.entites.OrderDetail;

import java.util.Date;
import java.util.List;

public interface OrderDetailService {
    OrderDetail save(OrderDetail orderDetail);

    List<OrderDetail> getAllByOrderId(Long id);

    boolean checkProductAlreadyOrder(Long productId);

    List<StatisticRevenueResponseDto> statisticRevenue(Date dateFrom, Date dateTo);

//    void deleteAllByProductId(Long productId);
}
