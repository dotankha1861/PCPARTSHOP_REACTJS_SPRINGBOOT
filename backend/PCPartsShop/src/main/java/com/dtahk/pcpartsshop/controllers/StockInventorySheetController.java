package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.SISheetDetailDto;
import com.dtahk.pcpartsshop.dtos.SISheetDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetRequestDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetResponseDto;
import com.dtahk.pcpartsshop.services.StockInventorySheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/stock-inventory-sheet")
public class StockInventorySheetController {
    public static final String CREATE_STOCK_INVENTORY_SHEET_SUCCESSFULLY = "Tạo phiếu kiểm hàng thành công";
    public static final String GET_ALL_SI_SHEET_SUCCESSFULY = "Lấy danh sách phiếu kiểm thành công";
    public static final String GET_SI_SHEET_DETAIL_SUCCESSFULLY = "Lấy chi tiết phiếu kiểm thành công";
    private final StockInventorySheetService stockInventorySheetService;

    @PostMapping
    public ResponseEntity<RespBody> createStockInventorySheet(@RequestBody StockInventorySheetRequestDto stockInventorySheetRequestDto){
        StockInventorySheetResponseDto stockInventorySheetResponseDto = stockInventorySheetService
                .createStockInventorySheet(stockInventorySheetRequestDto);
        return ResponseEntity.created(URI.create("/stock-inventory-sheet/" + stockInventorySheetResponseDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_STOCK_INVENTORY_SHEET_SUCCESSFULLY)
                        .data(stockInventorySheetResponseDto)
                        .build()
                );
    }

    @GetMapping
    private ResponseEntity<RespBody> getAllStockInventorySheet(){
        List<StockInventorySheetResponseDto> listSISheet = stockInventorySheetService
                .getAllStockInventorySheet();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_SI_SHEET_SUCCESSFULY)
                .data(listSISheet)
                .build()
        );
    }

    @GetMapping("/{sisId}")
    private ResponseEntity<RespBody> getStockInventorySheetDetailBySISId(@PathVariable Long sisId){
        List<SISheetDetailResponseDto> siSheetDetailDtoList = stockInventorySheetService.getStockInventorySheetDetailBySISId(sisId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_SI_SHEET_DETAIL_SUCCESSFULLY)
                .data(siSheetDetailDtoList)
                .build()
        );
    }
}
