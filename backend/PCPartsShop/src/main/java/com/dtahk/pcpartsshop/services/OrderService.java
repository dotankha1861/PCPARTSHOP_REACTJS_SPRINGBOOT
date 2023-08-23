package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.dtahk.pcpartsshop.dtos.*;

import java.util.List;

public interface OrderService {
    public OrderResponseDto createOrder(OrderCreateRequestDto orderCreateRequestDto);

    public List<OrderResponseDto> getAllOrder();

    public void approveOrder(Long Id);

    List<OrderCustomerResponseDto> getAllOrderCustomer();

    public void cancelOrder(Long orderId);

    List<OrderDetailResponseDto> getOrderDetailByOrderId(Long orderId);

    void updateStatusOrder(Long orderId, OrderStatus orderStatus);

    List<StatisticRevenueResponseDto> statisticRevenue(StatisticRevenueRequestDto statisticRevenueRequestDto);
}
