package com.dtahk.pcpartsshop.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StockInventorySheetRequestDto {
    private List<SISheetDetailDto> sheetDetails;
}
