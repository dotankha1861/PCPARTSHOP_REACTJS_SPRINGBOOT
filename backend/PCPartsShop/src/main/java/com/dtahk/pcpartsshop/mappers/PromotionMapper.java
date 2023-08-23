package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.PromotionCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.PromotionResponseDto;
import com.dtahk.pcpartsshop.entites.Promotion;
import com.dtahk.pcpartsshop.repositories.PromotionRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    Promotion promotionCreateRequestDtoToPromotion(PromotionCreateRequestDto promotionCreateRequestDto);
    void promotionCreateRequestDtoToPromotion(PromotionCreateRequestDto promotionCreateRequestDto,
                                              @MappingTarget Promotion promotion);

    PromotionResponseDto promotionToPromotionResponseDto(Promotion promotion);


    @Mapping(target = "listCategories", ignore = true)
    PromotionDetailResponseDto promotionToPromotionDetailResponseDto(Promotion promotion);
}
