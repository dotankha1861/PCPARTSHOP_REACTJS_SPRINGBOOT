package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.dtahk.pcpartsshop.entites.Customer;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrderResponseDto {

    private Long id;

    private String fullName;

    private String address;
    private String phone;

    private String email;

    private String note;

    @JsonFormat(pattern = "HH:mm:ss dd/MM/yyyy")
    private LocalDateTime createdAt;

    private OrderStatus status;


    private Long employeeId;
    private String employeeName;

    private Long customerId;
    private String customerName;

}
