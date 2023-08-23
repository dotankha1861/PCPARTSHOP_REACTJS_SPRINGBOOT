package com.dtahk.pcpartsshop.services;


import com.dtahk.pcpartsshop.dtos.SISheetDetailDto;
import com.dtahk.pcpartsshop.dtos.SISheetDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetRequestDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

public interface StockInventorySheetService {

    StockInventorySheetResponseDto createStockInventorySheet(StockInventorySheetRequestDto stockInventorySheetRequestDto);

    List<StockInventorySheetResponseDto> getAllStockInventorySheet();

    List<SISheetDetailResponseDto> getStockInventorySheetDetailBySISId(Long sisId);
}
