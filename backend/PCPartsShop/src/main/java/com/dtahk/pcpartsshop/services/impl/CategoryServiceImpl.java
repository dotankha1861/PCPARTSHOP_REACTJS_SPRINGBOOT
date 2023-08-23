package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.CategoryCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.CategoryResponseDto;
import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.entites.Promotion;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.CategoryMapper;
import com.dtahk.pcpartsshop.repositories.CategoryRepository;
import com.dtahk.pcpartsshop.repositories.ProductRepository;
import com.dtahk.pcpartsshop.services.CategoryService;
import com.dtahk.pcpartsshop.services.ImageService;
import com.dtahk.pcpartsshop.services.ProductService;
import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    public static final String CATEGORY_NAME_ALREADY_IN_USE = "Tên danh mục đã được sử dụng";
    public static final String CATEGORY_NOT_EXIST = "Danh mục không tồn tại";
    public static final String CATEGORY_NOT_FOUND = "Không tìm thấy danh mục #";
    public static final String CATEGORY_HAS_PRODUCTS = "Danh mục đã có sản phẩm không thể xóa";
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ProductRepository productRepository;
    private final ImageService imageService;

    public static final String PATH_IMAGE_CATEGORIES = "categories/";

    @Override
    public List<CategoryResponseDto> getAllCategory() {
        List<Category> categoryList = categoryRepository.findAll();
        return categoryList.stream()
                .map(categoryMapper::categoryToCategoryResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponseDto> getCategoriesByPromotion(Promotion promotion) {
        return categoryRepository.findByListPromotions(promotion).stream().map(
                categoryMapper::categoryToCategoryResponseDto
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponseDto createCategory(@ModelAttribute CategoryCreateRequestDto categoryRequestDto) {
        throwIfCategoryNameAlreadyExist(categoryRequestDto.getName());
        Category category = categoryMapper.categoryCreateRequestDtoToCategory(categoryRequestDto);
        category.setActive(true);
        if (categoryRequestDto.getImage() != null) {
            String uri = PATH_IMAGE_CATEGORIES + UUID.randomUUID();
            imageService.saveImage(categoryRequestDto.getImage(), uri + ".jpg");
            category.setImage(UploadFileUtil.URL + uri);
        }
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.categoryToCategoryResponseDto(savedCategory);
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> {
            throw new AppException(CATEGORY_NOT_FOUND + id, HttpStatus.NOT_FOUND);
        });
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(CategoryUpdateRequestDto categoryUpdateRequestDto, Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> {
            throw new AppException(CATEGORY_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if (!category.getName().equals(categoryUpdateRequestDto.getName()))
            throwIfCategoryNameAlreadyExist(categoryUpdateRequestDto.getName());
        if (categoryUpdateRequestDto.getImage() != null) {
            if (category.getImage() != null) {
                imageService.deleteImage(category.getImage().split(UploadFileUtil.URL)[1] + ".jpg");
            }
            String uri = PATH_IMAGE_CATEGORIES + UUID.randomUUID();
            imageService.saveImage(categoryUpdateRequestDto.getImage(), uri + ".jpg");
            category.setImage(UploadFileUtil.URL + uri);
        }
        category.setActive(categoryUpdateRequestDto.isActive());
        category.setName(categoryUpdateRequestDto.getName());
        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.categoryToCategoryResponseDto(savedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> {
            throw new AppException(CATEGORY_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if(productRepository.existsByCategoryId(id))
            throw new AppException(CATEGORY_HAS_PRODUCTS, HttpStatus.EXPECTATION_FAILED);
        categoryRepository.deleteById(id);
        if (category.getImage() != null)
            imageService.deleteImage(category.getImage().split(UploadFileUtil.URL)[1] + ".jpg");
    }

    private void throwIfCategoryNameAlreadyExist(String name) {
        if (categoryRepository.existsByName(name)) {
            throw new AppException(CATEGORY_NAME_ALREADY_IN_USE, HttpStatus.FOUND);
        }
    }
}
