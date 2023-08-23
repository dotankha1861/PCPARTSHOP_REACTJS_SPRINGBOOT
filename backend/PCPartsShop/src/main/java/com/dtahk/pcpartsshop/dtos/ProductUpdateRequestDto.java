package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProductUpdateRequestDto {
    private String skuCode;
    private String name;
    private MultipartFile image;
    private double price;
    private boolean active;
    private String shortDesc;
    private String detailDesc;
    private Long categoryId;
}
