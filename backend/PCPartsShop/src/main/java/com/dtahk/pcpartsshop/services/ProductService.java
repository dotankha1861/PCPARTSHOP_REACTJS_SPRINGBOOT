package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.ProductCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductUpdateRequestDto;
import com.dtahk.pcpartsshop.entites.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.security.core.parameters.P;

import java.util.List;
import java.util.Map;

public interface ProductService {
    public List<ProductResponseDto> getProductsWithDiscount();

    public ProductDetailResponseDto getProductWithDiscountBySkuCode(String skuCode);

    public Product getProductBySkuCode(String skuCode);

    public Product getProductById(Long id);

    ProductDetailResponseDto createProduct(ProductCreateRequestDto productCreateRequestDto);

    void deleteProduct(Long productId);

    ProductDetailResponseDto updateProduct(ProductUpdateRequestDto productUpdateRequestDto, Long productId);

    void updateQuantity(Long productId, int difference);
}
