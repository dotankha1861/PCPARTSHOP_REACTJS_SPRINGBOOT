package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderDetailResponseDto {
    private String skuCode;
    private String name;
    private String image;
    private int quantity;
    private double price;
    private double discount;
}
