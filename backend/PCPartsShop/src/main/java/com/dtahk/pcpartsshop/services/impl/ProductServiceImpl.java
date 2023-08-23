package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.entites.Product;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.ProductMapper;
import com.dtahk.pcpartsshop.repositories.ProductRepository;
import com.dtahk.pcpartsshop.repositories.PromotionRepository;
import com.dtahk.pcpartsshop.services.*;
import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    public static final String PRODUCT_NOT_EXIST = "Sản phẩm không tồn tại";
    public static final String SKUCODE_ALREADY_EXIST = "Mã sản phẩm đã tồn tại";
    public static final String PRODUCT_NAME_ALREADY_EXIST = "Tên sản phẩm đã tồn tại rồi";
    public static final String ORDER_ALREADY_ORDER = "Sản phẩm đã có đơn đặt hàng";
    public static final String PRODUCT_HAS_TRANSACTION = "Sản phẩm đã đưa vào hoạt động thể xóa";
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ImageService imageService;
    private final CategoryServiceImpl categoryService;
    private final OrderDetailService orderDetailService;
    public static final String PATH_IMAGE_PRODUCTS = "products/";

    @Transactional
    public List<ProductResponseDto> getProductsWithDiscount() {
        return productRepository.getProductsWithDiscount();
    }

    @Override
    @Transactional
    public ProductDetailResponseDto getProductWithDiscountBySkuCode(String skuCode) {
        return productRepository.getProductWithDiscountBySkuCode(skuCode);
    }

    @Override
    public Product getProductBySkuCode(String skuCode) {
        return productRepository.findBySkuCode(skuCode).orElseThrow(() -> {
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> {
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
    }

    @Override
    @Transactional
    public ProductDetailResponseDto createProduct(ProductCreateRequestDto productCreateRequestDto) {
        log.info(productCreateRequestDto.toString());
        if (productRepository.existsBySkuCode(productCreateRequestDto.getSkuCode()))
            throw new AppException(SKUCODE_ALREADY_EXIST, HttpStatus.FOUND);
        if (productRepository.existsByName(productCreateRequestDto.getName()))
            throw new AppException(PRODUCT_NAME_ALREADY_EXIST, HttpStatus.FOUND);

        Product product = productMapper.productCreateRequestDtoToProduct(productCreateRequestDto);
        product.setActive(true);
        if (productCreateRequestDto.getImage() != null) {
            String uri = PATH_IMAGE_PRODUCTS + UUID.randomUUID();
            imageService.saveImage(productCreateRequestDto.getImage(), uri + ".jpg");
            product.setImage(UploadFileUtil.URL + uri);
        }

        product.setCategory(categoryService.getCategoryById(productCreateRequestDto.getCategoryId()));
        Product savedProduct = productRepository.save(product);
        ProductDetailResponseDto productDetailResponseDto = getProductWithDiscountBySkuCode(savedProduct.getSkuCode());
        productDetailResponseDto.setCategoryId(productCreateRequestDto.getCategoryId());
        return productDetailResponseDto;
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        if(!productRepository.existsById(productId))
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        if(orderDetailService.checkProductAlreadyOrder(productId))
            throw new AppException(ORDER_ALREADY_ORDER, HttpStatus.EXPECTATION_FAILED);
        productRepository.deleteById(productId);
    }

    @Override
    public ProductDetailResponseDto updateProduct(ProductUpdateRequestDto productUpdateRequestDto, Long productId) {
        Product product =  productRepository.findById(productId).orElseThrow(() -> {
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        });

        if(!product.getName().equals(productUpdateRequestDto.getName()))
            throwIfProductNameAlreadyExist(productUpdateRequestDto.getName());

        if(productUpdateRequestDto.getImage() != null) {
            if(product.getImage() != null ){
                imageService.deleteImage(product.getImage().split(UploadFileUtil.URL)[1] + ".jpg");
            }
            String uri = PATH_IMAGE_PRODUCTS + UUID.randomUUID();
            imageService.saveImage(productUpdateRequestDto.getImage(), uri + ".jpg");
            product.setImage(UploadFileUtil.URL + uri);
        }
        log.info(productUpdateRequestDto.toString());
        productMapper.productUpdateRequestDtoToProduct(productUpdateRequestDto, product);
        product.setCategory(categoryService.getCategoryById(productUpdateRequestDto.getCategoryId()));
        Product savedProduct = productRepository.save(product);
        ProductDetailResponseDto productDetailResponseDto = getProductWithDiscountBySkuCode(savedProduct.getSkuCode());
        productDetailResponseDto.setCategoryId(productUpdateRequestDto.getCategoryId());
        return productDetailResponseDto;
    }

    @Override
    public void updateQuantity(Long productId, int difference) {
        Product product =  productRepository.findById(productId).orElseThrow(() -> {
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        product.setQuantity(product.getQuantity() + difference);
        productRepository.save(product);
    }

    private void throwIfProductNameAlreadyExist(String name) {
        if (productRepository.existsByName(name)) {
            throw new AppException(PRODUCT_NAME_ALREADY_EXIST, HttpStatus.FOUND);
        }
    }
}
