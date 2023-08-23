package com.dtahk.pcpartsshop.dtos;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class UpdateStatusOrderRequestDto {
    private OrderStatus status;
}
