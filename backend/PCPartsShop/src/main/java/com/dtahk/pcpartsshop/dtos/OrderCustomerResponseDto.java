package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderCustomerResponseDto {
    private String id;
    private String firstProductImage;
    private String firstProductName;
    private int quantityProduct;
    private double total;
    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime createdAt;
    private OrderStatus status;
    private String fullName;

    private String address;
    private String phone;

    private String email;

    private String note;
}
