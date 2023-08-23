package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.repositories.CategoryRepository;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDetailResponseDto {
    private Long id;
    private String name;

    private double discount;

    private double priceFrom;

    private double priceTo;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime effectiveDate;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime expirationDate;

    private Long createdId;

    private String createdName;

    private List<CategoryResponseDto> listCategories;
}
