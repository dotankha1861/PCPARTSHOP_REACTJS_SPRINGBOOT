package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import com.dtahk.pcpartsshop.services.OrderService;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {
    public static final String CREATE_ORDER_SUCCESSFULLY = "Tạo đơn hàng thành công";
    public static final String GET_ALL_ORDER_SUCCESSFULLY = "Lấy danh sách đơn hàng thành công";
    public static final String APPROVE_ORDER_SUCCESSFULLY = "Duyệt đơn hàng thành công";
    public static final String GET_LIST_ORDER_CUSTOMER_SUCCESSFULLY = "Lấy danh sách đơn hàng của khách hàng thành công";
    public static final String CANCEL_ORDER_SUCCESSFULLY = "Hủy đơn hàng thành công";
    public static final String GET_ORDER_DETAILS_SUCCESSFULLY = "Lấy chi tiết đơn hàng thành công";
    public static final String UPDATE_STATUS_ORDER_SUCCESSFULLY = "Cập nhật trạng thái đơn hàng thành công";
    public static final String GET_STATISTIC_REVENUE_SUCCESSFULLY = "Lấy danh sách doanh thu thành công";
    private final OrderService orderService;
    @PostMapping
    public ResponseEntity<RespBody> createOrder(@RequestBody OrderCreateRequestDto orderCreateRequestDto){
        OrderResponseDto orderResponseDto = orderService.createOrder(orderCreateRequestDto);
        return ResponseEntity.created(URI.create("/orders/" +orderResponseDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_ORDER_SUCCESSFULLY)
                        .data(orderResponseDto)
                        .build()
                );
    }

    @GetMapping
    public ResponseEntity<RespBody> getAllOrder(){
        List<OrderResponseDto> listOrders = orderService.getAllOrder();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_ORDER_SUCCESSFULLY)
                .data(listOrders)
                .build()
        );
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<RespBody> approveOrder(@PathVariable Long id){
        orderService.approveOrder(id);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(APPROVE_ORDER_SUCCESSFULLY)
                .data(null)
                .build()
        );
    }

    @GetMapping("/customer")
    public ResponseEntity<RespBody> getAllOrderCustomer(){
        List<OrderCustomerResponseDto> listOrder = orderService.getAllOrderCustomer();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_LIST_ORDER_CUSTOMER_SUCCESSFULLY)
                .data(listOrder)
                .build()
        );
    }
    @DeleteMapping("/{orderId}")
    public ResponseEntity<RespBody> cancelOrder(@PathVariable Long orderId){
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(CANCEL_ORDER_SUCCESSFULLY)
                .build()
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<RespBody> getOrderDetailByOrderId(@PathVariable Long orderId){
        List<OrderDetailResponseDto> listOderDetails = orderService.getOrderDetailByOrderId(orderId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ORDER_DETAILS_SUCCESSFULLY)
                .data(listOderDetails)
                .build()
        );
    }

    @PutMapping("/status/{orderId}")
    public ResponseEntity<RespBody> updateStatusOrder(
            @RequestBody UpdateStatusOrderRequestDto updateStatusOrderRequestDto,
            @PathVariable Long orderId){
        orderService.updateStatusOrder(orderId, updateStatusOrderRequestDto.getStatus());
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_STATUS_ORDER_SUCCESSFULLY)
                .build()
        );
    }
    @PostMapping("/statistic-revenue")
    public ResponseEntity<RespBody> statisticRevenue(@RequestBody StatisticRevenueRequestDto statisticRevenueRequestDto){
        List<StatisticRevenueResponseDto> responseDtoList = orderService.statisticRevenue(statisticRevenueRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_STATISTIC_REVENUE_SUCCESSFULLY)
                .data(responseDtoList)
                .build()
        );
    }
}
