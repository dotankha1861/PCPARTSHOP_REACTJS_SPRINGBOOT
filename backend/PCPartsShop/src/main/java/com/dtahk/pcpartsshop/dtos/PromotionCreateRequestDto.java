package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.entites.Employee;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PromotionCreateRequestDto {
    private String name;

    private double discount;

    private double priceFrom;

    private double priceTo;

    private LocalDateTime effectiveDate;

    private LocalDateTime expirationDate;

    private List<Long> listCategoriesId;
}
