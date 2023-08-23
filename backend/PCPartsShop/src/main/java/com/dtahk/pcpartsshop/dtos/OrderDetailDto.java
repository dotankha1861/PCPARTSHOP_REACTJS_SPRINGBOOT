package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.entites.Order;
import com.dtahk.pcpartsshop.entites.OrderDetailKey;
import com.dtahk.pcpartsshop.entites.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderDetailDto {
    private String skuCode;

    private int quantity;

    private double price;

    private double discount;
}
