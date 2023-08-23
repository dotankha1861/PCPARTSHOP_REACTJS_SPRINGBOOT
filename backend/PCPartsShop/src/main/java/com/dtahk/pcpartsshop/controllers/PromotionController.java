package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.ProductCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.PromotionResponseDto;
import com.dtahk.pcpartsshop.repositories.PromotionRepository;
import com.dtahk.pcpartsshop.services.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/promotions")
public class PromotionController {
    public static final String CREATE_PROMOTION_SUCCESSFULLY = "Tạo chương trình khuyến mãi thành công";
    public static final String GET_ALL_PROMOTION_SUCCESSFULLY = "Lấy danh sách chương trình khuyến mãi thành công";
    public static final String GET_PROMOTION_SUCCESSFULLY = "Lấy thành công chương trình khuyến mãi #";
    public static final String DELETE_PROMOTION_SUCCESSFULLY = "Xóa chương trình khuyến mãi thành công";
    public static final String UPDATE_PROMOTION_SUCCESSFULLY = "Cập nhật chương tình khuyến mãi thành công";
    public static final String CANCEL_PROMOTION_SUCCESSFULLY = "Hủy chương trình khuyến mãi thành công";
    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<RespBody> getAllPromotion(){
        List<PromotionResponseDto> listPromotions = promotionService.getAllPromotion();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_PROMOTION_SUCCESSFULLY)
                .data(listPromotions)
                .build()
        );
    }
    @GetMapping("/{id}")
    public  ResponseEntity<RespBody> getPromotionById(@PathVariable Long id){
        PromotionDetailResponseDto promotionDetailResponseDto = promotionService.getPromotionById(id);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_PROMOTION_SUCCESSFULLY + promotionDetailResponseDto.getId())
                .data(promotionDetailResponseDto)
                .build()
        );
    }

    @PostMapping
    public ResponseEntity<RespBody> createPromotion(@RequestBody @Valid PromotionCreateRequestDto promotionCreateRequestDto){
        PromotionResponseDto promotionResponseDto = promotionService.createPromotion(promotionCreateRequestDto);
        return ResponseEntity.created(URI.create("/promotions/" + promotionResponseDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_PROMOTION_SUCCESSFULLY)
                        .data(promotionResponseDto)
                        .build()
                );
    }
    @PutMapping("/{promotionId}")
    public ResponseEntity<RespBody> updatePromotion(
            @PathVariable Long promotionId,
            @RequestBody PromotionCreateRequestDto promotionCreateRequestDto){
        PromotionResponseDto promotionResponseDto = promotionService.updatePromotion(promotionCreateRequestDto, promotionId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_PROMOTION_SUCCESSFULLY)
                .data(promotionResponseDto)
                .build()
        );
    }
    @DeleteMapping("/{promotionId}")
    public ResponseEntity<RespBody> deletePromotion(@PathVariable Long promotionId){
        promotionService.deletePromotion(promotionId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_PROMOTION_SUCCESSFULLY)
                .build()
        );
    }

    @PutMapping("/cancel/{promotionId}")
    public ResponseEntity<RespBody> cancelPromotion(@PathVariable Long promotionId){
        PromotionResponseDto promotionResponseDto = promotionService.cancelPromotion(promotionId);
        return  ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(CANCEL_PROMOTION_SUCCESSFULLY)
                .data(promotionResponseDto)
                .build()
        );
    }

}

