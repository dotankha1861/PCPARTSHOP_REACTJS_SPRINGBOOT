package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.entites.CartItem;
import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import com.dtahk.pcpartsshop.entites.StockInventorySheetDetail;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailResponseDto {
    private Long id;

    private String skuCode;

    private String name;

    private String image;

    private double price;

    private int quantity;

    private Double discount;

    private Boolean active;

    private String shortDesc;

    private String detailDesc;
    private Long categoryId;
}
