package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import com.dtahk.pcpartsshop.entites.Product;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.SqlResultSetMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySkuCode(String skuCode);
    @Query(nativeQuery = true)
    List<ProductResponseDto> getProductsWithDiscount();

    @Query(nativeQuery = true)
    ProductDetailResponseDto getProductWithDiscountBySkuCode(@Param("skuCode") String skuCode);

    boolean existsBySkuCode(String skuCode);

    boolean existsByName(String name);

    boolean existsByCategoryId(Long categoryId);
}
