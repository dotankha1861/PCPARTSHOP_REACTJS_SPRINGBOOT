package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.PromotionCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.PromotionResponseDto;

import java.util.List;

public interface PromotionService {
    public List<PromotionResponseDto> getAllPromotion ();
    public PromotionDetailResponseDto getPromotionById(Long id);
    public PromotionResponseDto createPromotion(PromotionCreateRequestDto promotionCreateRequestDto);

    void deletePromotion(Long promotionId);

    PromotionResponseDto updatePromotion(PromotionCreateRequestDto promotionCreateRequestDto, Long promotionId);

    PromotionResponseDto cancelPromotion(Long promotionId);
}
