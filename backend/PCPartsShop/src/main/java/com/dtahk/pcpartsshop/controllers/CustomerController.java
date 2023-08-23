package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.dtos.CategoryUpdateRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerRequestDto;
import com.dtahk.pcpartsshop.dtos.CustomerResponseDto;
import com.dtahk.pcpartsshop.dtos.CustomerUpdateRequestDto;
import com.dtahk.pcpartsshop.services.CustomerService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.Column;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/customers")
public class CustomerController {
    public static final String GET_ALL_CUSTOMER_SUCCESSFULLY = "Lấy danh sách khách hàng thành công";
    public static final String UPDATE_PROFILE_SUCCESSFULLY = "Cập nhật thông tin thành công";
    public static final String BLOCK_CUSTOMER_SUCCESSFULLY = "Khóa tài khoản khách hàng thành công";
    public static final String UNBLOCK_CUSTOMER_SUCCESSFULLY = "Mở khóa tài khoản khách hàng thành công";
    public static final String DELETE_CUSTOMER_SUCCESSFULLY = "Xóa khách hàng thành công";
    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<RespBody> getAllCustomer(){
        List<CustomerResponseDto> listCustomers = customerService.getAllCustomer();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_CUSTOMER_SUCCESSFULLY)
                .data(listCustomers)
                .build()
        );
    }
    @PostMapping
    ResponseEntity<RespBody> updateCustomer(@RequestBody @Valid CustomerUpdateRequestDto customerUpdateRequestDto){
        CustomerResponseDto customerResponseDto = customerService.updateCustomer(customerUpdateRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_PROFILE_SUCCESSFULLY)
                .data(customerResponseDto)
                .build()
        );

    }
    @PutMapping("/{customerId}")
    public ResponseEntity<RespBody> activeCustomer(@PathVariable Long customerId, @RequestParam("active") Boolean active){
        customerService.activeCustomer(customerId, active);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(active ? BLOCK_CUSTOMER_SUCCESSFULLY : UNBLOCK_CUSTOMER_SUCCESSFULLY)
                .build()
        );
    }
    @DeleteMapping("/{customerId}")
    public  ResponseEntity<RespBody> deleteCustomer(@PathVariable Long customerId){
        customerService.deleteCustomer(customerId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_CUSTOMER_SUCCESSFULLY)
                .build()
        );
    }
}
