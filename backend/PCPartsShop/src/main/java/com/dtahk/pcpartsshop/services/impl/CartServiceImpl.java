package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.CartAddRequestDto;
import com.dtahk.pcpartsshop.dtos.CartItemResponseDto;
import com.dtahk.pcpartsshop.dtos.CartMergeRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerResponseDto;
import com.dtahk.pcpartsshop.entites.*;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.repositories.CartRepository;
import com.dtahk.pcpartsshop.services.CartService;
import com.dtahk.pcpartsshop.services.CustomerService;
import com.dtahk.pcpartsshop.services.ProductService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    public static final String PRODUCT_ALREADY_EXIST = "Sản phẩm đã tồn tại trong giỏ hàng";
    public static final String PRODUCT_NOT_EXIST = "Sản phẩm không tồn tại trong giỏ hàng";
    private final CartRepository cartRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    @Override
    public CartItemResponseDto cartAddToCart(CartAddRequestDto cartAddRequestDto) {
        CartItem cartItem = CartItem.builder().quantity(cartAddRequestDto.getQuantity()).build();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        cartItem.setCustomer(customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId()));
        cartItem.setProduct(productService.getProductBySkuCode(cartAddRequestDto.getSkuCode()));
        CartItemKey cartItemKey = CartItemKey.builder()
                .productId(cartItem.getProduct().getId())
                .customerId(cartItem.getCustomer().getId())
                .build();
        Optional<CartItem> optional = cartRepository.findById(cartItemKey);
        if(optional.isPresent()) throw new AppException(PRODUCT_ALREADY_EXIST, HttpStatus.FOUND);
        cartItem.setId(cartItemKey);
        CartItem savedCartItem = cartRepository.save(cartItem);
        return CartItemResponseDto.builder().skuCode(savedCartItem.getProduct().getSkuCode())
                .quantity(savedCartItem.getQuantity())
                .build();
    }

    @Override
    public void deleteFromCart(String skuCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        cartRepository.deleteById(CartItemKey.builder()
                .customerId(customerService.getCustomerByUserId(((User) authentication
                        .getPrincipal()).getId()).getId())
                .productId(productService.getProductBySkuCode(skuCode).getId())
                .build());
    }

    @Override
    public List<CartItemResponseDto> getAllCartItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Customer customer = customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId());
        return cartRepository.findAllByCustomer(customer).stream().map(cartItem ->
            CartItemResponseDto.builder()
                    .skuCode(cartItem.getProduct().getSkuCode())
                    .quantity(cartItem.getQuantity())
                    .build()
        ).collect(Collectors.toList());
    }

    @Override
    public CartItemResponseDto updateCartItem(CartAddRequestDto cartAddRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CartItem cartItem = CartItem.builder().quantity(cartAddRequestDto.getQuantity()).build();
        cartItem.setCustomer(customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId()));
        cartItem.setProduct(productService.getProductBySkuCode(cartAddRequestDto.getSkuCode()));
        CartItemKey cartItemKey = CartItemKey.builder()
                .productId(cartItem.getProduct().getId())
                .customerId(cartItem.getCustomer().getId())
                .build();
        cartRepository.findById(cartItemKey).orElseThrow(() -> {
            throw new AppException(PRODUCT_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        cartItem.setId(cartItemKey);
        CartItem savedCartItem = cartRepository.save(cartItem);
        return CartItemResponseDto.builder().skuCode(savedCartItem.getProduct().getSkuCode())
                .quantity(savedCartItem.getQuantity())
                .build();
    }

    @Override
    @Transactional
    public void mergeCartItem(CartMergeRequestDto cartMergeRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Customer customer = customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId());
        cartMergeRequestDto.getListCartItem().forEach(cartAddRequestDto -> {
            Product product = productService.getProductBySkuCode(cartAddRequestDto.getSkuCode());
            CartItemKey cartItemKey = CartItemKey.builder()
                    .productId(product.getId())
                    .customerId(customer.getId())
                    .build();
            Optional<CartItem> optional = cartRepository.findById(cartItemKey);
            CartItem cartItem;
            if(optional.isEmpty()){
                cartItem = CartItem.builder().product(product)
                        .customer(customer)
                        .quantity(cartAddRequestDto.getQuantity())
                        .id(cartItemKey)
                        .build();
            }
            else {
                cartItem = optional.get();
                cartItem.setQuantity(cartItem.getQuantity() + cartItem.getQuantity());
            }

            cartRepository.save(cartItem);
        });
    }

    @Override
    @Transactional
    public void refreshCart() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Customer customer = customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId());
        cartRepository.deleteAllByCustomerId(customer.getId());
    }
}


