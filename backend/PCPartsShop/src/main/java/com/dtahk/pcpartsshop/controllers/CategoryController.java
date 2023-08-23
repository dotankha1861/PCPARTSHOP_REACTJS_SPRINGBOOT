package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.CategoryCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.CategoryResponseDto;
import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/categories")
@Slf4j
public class CategoryController {
    public static final String GET_ALL_CATEGORIES_SUCCESSFULLY = "lấy danh sách danh mục thành công";
    public static final String CREATE_CATEGORY_SUCCESSFULLY = "Tạo danh mục thành công";
    public static final String UPDATE_CATEGORY_SUCCESSFULLY = "Cập nhật thành công danh mục #";
    public static final String DELETE_CATEGORY_SUCCESSFULLY = "Xóa danh mục thành công";
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<RespBody> getAllCategory() {
        List<CategoryResponseDto> categoryList = categoryService.getAllCategory();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_CATEGORIES_SUCCESSFULLY)
                .data(categoryList)
                .build()
        );
    }

    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RespBody> createCategory(@ModelAttribute @Valid CategoryCreateRequestDto categoryRequestDto) {
        log.error(categoryRequestDto.toString());
        CategoryResponseDto categoryResponseDto = categoryService.createCategory(categoryRequestDto);
        return ResponseEntity.created(URI.create("/admin/employees/" + categoryResponseDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_CATEGORY_SUCCESSFULLY)
                        .data(categoryResponseDto)
                        .build())
                ;
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespBody> updateCategory(
            @ModelAttribute @Valid CategoryUpdateRequestDto categoryRequestDto,
            @PathVariable Long id
    ) {
        CategoryResponseDto categoryResponseDto = categoryService.updateCategory(categoryRequestDto, id);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_CATEGORY_SUCCESSFULLY + categoryResponseDto.getId())
                .data(categoryResponseDto)
                .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RespBody> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_CATEGORY_SUCCESSFULLY)
                .data(null)
                .build()
        );
    }
}
