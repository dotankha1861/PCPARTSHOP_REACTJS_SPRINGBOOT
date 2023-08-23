package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.CartAddRequestDto;
import com.dtahk.pcpartsshop.dtos.CartItemResponseDto;
import com.dtahk.pcpartsshop.dtos.CartMergeRequestDto;
import com.dtahk.pcpartsshop.entites.CartItemKey;
import com.dtahk.pcpartsshop.services.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/carts")
public class CartController {
    public static final String ADD_TO_CART_SUCCESSFULLY = "Thêm sản phẩm vào giỏ hàng thành công";
    public static final String DELETE_FROM_CART_SUCCESSFULLY = "Xóa sản phẩm khỏi giỏ hàng thành công";
    public static final String GET_CART_SUCCESSFULLY = "Lấy giỏ hàng thành công";
    public static final String UPDATE_CART_ITEM_SUCCESSFULL = "Cập nhật sản phẩm trong giỏ hàng thành công";
    public static final String MERGE_CART_ITEM_SUCCESSFULLY = "Gộp giỏ hàng thành công";
    public static final String REFRESH_CART_SUCCESSFULLY = "Làm mới giỏ hàng thành công";
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<RespBody> getAllCartItem(){
        List<CartItemResponseDto> listCartItems = cartService.getAllCartItems();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_CART_SUCCESSFULLY)
                .data(listCartItems)
                .build()
        );
    }

    @PostMapping
    public ResponseEntity<RespBody> addToCart(@RequestBody @Valid CartAddRequestDto cartAddRequestDto){
        CartItemResponseDto cartItemResponseDto = cartService.cartAddToCart(cartAddRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.CONTINUE.value())
                .message(ADD_TO_CART_SUCCESSFULLY)
                .data(cartItemResponseDto)
                .build()
        );
    }

    @PutMapping
    public ResponseEntity<RespBody> updateCartItem(@RequestBody @Valid CartAddRequestDto cartAddRequestDto){
        CartItemResponseDto cartItemResponseDto = cartService.updateCartItem(cartAddRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.CONTINUE.value())
                .message(UPDATE_CART_ITEM_SUCCESSFULL)
                .data(cartItemResponseDto)
                .build()
        );
    }

    @DeleteMapping("/{skuCode}")
    public ResponseEntity<RespBody> deleteFromCart(@PathVariable String skuCode){
        cartService.deleteFromCart(skuCode);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_FROM_CART_SUCCESSFULLY)
                .build()
        );
    }

    @PutMapping("/merge")
    public ResponseEntity<RespBody> mergeCartItems(@RequestBody CartMergeRequestDto cartMergeRequestDto){
        cartService.mergeCartItem(cartMergeRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(MERGE_CART_ITEM_SUCCESSFULLY)
                .build()
        );
    }

    @DeleteMapping("/refresh")
    public ResponseEntity<RespBody> refreshCart(){
        cartService.refreshCart();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(REFRESH_CART_SUCCESSFULLY)
                .build()
        );
    }
}

