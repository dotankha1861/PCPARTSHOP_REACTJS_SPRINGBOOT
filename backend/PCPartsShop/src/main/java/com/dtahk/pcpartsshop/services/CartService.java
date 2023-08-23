package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.CartAddRequestDto;
import com.dtahk.pcpartsshop.dtos.CartItemResponseDto;
import com.dtahk.pcpartsshop.dtos.CartMergeRequestDto;

import java.util.List;

public interface CartService {
    public CartItemResponseDto cartAddToCart(CartAddRequestDto cartAddRequestDto);
    public void deleteFromCart(String skuCode);

    List<CartItemResponseDto> getAllCartItems();

    CartItemResponseDto updateCartItem(CartAddRequestDto cartAddRequestDto);

    void mergeCartItem(CartMergeRequestDto cartMergeRequestDto);

    void refreshCart();
}
