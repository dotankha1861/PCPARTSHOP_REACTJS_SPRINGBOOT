package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.ProductCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductUpdateRequestDto;
import com.dtahk.pcpartsshop.entites.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "image", ignore = true)
    Product productCreateRequestDtoToProduct(ProductCreateRequestDto productCreateRequestDto);

    @Mapping(target = "image", ignore = true)
    void productUpdateRequestDtoToProduct(ProductUpdateRequestDto productUpdateRequestDto,
                                         @MappingTarget Product product);
}
