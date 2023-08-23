package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class SISheetDetailDto {
    private Long productId;
    private int initialQuantity;
    private int actualQuantity;
}
