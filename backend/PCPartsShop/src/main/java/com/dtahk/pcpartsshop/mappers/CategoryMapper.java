package com.dtahk.pcpartsshop.mappers;

import com.dtahk.pcpartsshop.dtos.CategoryCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.CategoryResponseDto;
import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.entites.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponseDto categoryToCategoryResponseDto(Category category);

    @Mapping(target = "image", ignore = true)
    Category categoryCreateRequestDtoToCategory(CategoryCreateRequestDto categoryRequestDto);

    @Mapping(target = "image", ignore = true)
    Category categoryUpdateRequestDtoToCategory(CategoryUpdateRequestDto categoryUpdateRequestDto);
}
