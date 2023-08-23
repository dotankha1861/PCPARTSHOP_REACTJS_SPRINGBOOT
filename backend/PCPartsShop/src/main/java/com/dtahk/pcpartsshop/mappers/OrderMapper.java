package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Order;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    Order orderCreateRequestDtoToOrder(OrderCreateRequestDto orderCreateRequestDto);

    OrderDetail orderDetailDtoToOrderDetail(OrderDetailDto orderDetailDto);

    OrderResponseDto orderToOrderResponseDto (Order order);

    OrderCustomerResponseDto orderToOrderCustomerResponseDto(Order order);
    @Mapping(target = "skuCode", source = "product.skuCode")
    @Mapping(target = "name", source = "product.name")
    @Mapping(target = "image", source = "product.image")
    OrderDetailResponseDto orderDetailToOrderDetailResponseDto(OrderDetail orderDetail);
}
