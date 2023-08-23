package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponseDto {
    private Long id;
    private String skuCode;
    private String name;
    private String image;
    private double price;
    private Boolean active;
    private int quantity;
    private double discount;
    private Long categoryId;
}
