package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class SISheetDetailResponseDto {
    private Long productId;
    private String productName;
    private String skuCode;
    private String image;
    private int initialQuantity;
    private int actualQuantity;
}
