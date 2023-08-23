package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.StockInventorySheetRequestDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetResponseDto;
import com.dtahk.pcpartsshop.entites.StockInventorySheet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StockInventorySheetMapper {
    StockInventorySheet SISheetRequestDtoToSISheet(StockInventorySheetRequestDto stockInventorySheetRequestDto);

    StockInventorySheetResponseDto SISheetToSISheetResponseDto(StockInventorySheet stockInventorySheet);
}
