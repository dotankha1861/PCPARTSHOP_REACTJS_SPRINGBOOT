package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.CategoryCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.CategoryResponseDto;
import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.entites.Promotion;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDto> getAllCategory();

    List<CategoryResponseDto> getCategoriesByPromotion(Promotion promotion);

    CategoryResponseDto createCategory(CategoryCreateRequestDto categoryRequestDto);

    CategoryResponseDto updateCategory(CategoryUpdateRequestDto categoryUpdateRequestDto, Long id);

    void deleteCategory(Long id);
}
