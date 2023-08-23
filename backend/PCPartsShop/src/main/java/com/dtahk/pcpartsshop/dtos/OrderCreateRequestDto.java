package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderCreateRequestDto {
    private String fullName;

    private String phone;
    private String address;

    private String email;

    private String note;

    private List<OrderDetailDto> orderDetails;
}
