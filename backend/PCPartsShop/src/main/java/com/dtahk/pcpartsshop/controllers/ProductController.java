package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.ProductCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductUpdateRequestDto;
import com.dtahk.pcpartsshop.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {
    public static final String GET_ALL_PRODUCTS_WITH_DISCOUNT_SUCCESSFULLY = "Lấy danh sách sản phẩm cùng khuyến mãi thành công";
    public static final String GET_PRODUCT_WITH_DISCOUNT_SUCCESSFULLY = "Lấy sản phẩm với khuyến mãi thành công";
    public static final String CREATE_PRODUCT_SUCCESSFULLY = "Tạo sản phẩm thành công";
    public static final String DELETE_PRODUCT_SUCCESSFULLY = "Xóa sản phẩm thành công";
    public static final String UPDATE_PRODUCT_SUCCESSFULLY = "Cập nhật sản phẩm thành công";
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<RespBody> getAllProductsWithDiscount() {
        List<ProductResponseDto> listProducts = productService.getProductsWithDiscount();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_PRODUCTS_WITH_DISCOUNT_SUCCESSFULLY)
                .data(listProducts)
                .build()
        );
    }

    @GetMapping("/{skuCode}")
    public ResponseEntity<RespBody> getProductWithDiscountBySkuCode(@PathVariable String skuCode) {
        ProductDetailResponseDto productDetailResponseDto = productService.getProductWithDiscountBySkuCode(skuCode);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_PRODUCT_WITH_DISCOUNT_SUCCESSFULLY)
                .data(productDetailResponseDto)
                .build()
        );
    }

    @PostMapping
    public ResponseEntity<RespBody> createProduct(@ModelAttribute ProductCreateRequestDto productCreateRequestDto) {
        ProductDetailResponseDto productDetailResponseDto = productService.createProduct(productCreateRequestDto);
        return ResponseEntity.created(URI.create("/products/" + productDetailResponseDto.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_PRODUCT_SUCCESSFULLY)
                        .data(productDetailResponseDto)
                        .build()
                );
    }

    @PutMapping("/{productId}")
    public ResponseEntity<RespBody> updateProduct(
            @PathVariable Long productId,
            @ModelAttribute ProductUpdateRequestDto productUpdateRequestDto){
        ProductDetailResponseDto productResponseDto = productService.updateProduct(productUpdateRequestDto, productId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_PRODUCT_SUCCESSFULLY)
                .data(productResponseDto)
                .build()
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<RespBody> deleteProduct(@PathVariable Long productId){
        productService.deleteProduct(productId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_PRODUCT_SUCCESSFULLY)
                .build()
        );
    }
}

