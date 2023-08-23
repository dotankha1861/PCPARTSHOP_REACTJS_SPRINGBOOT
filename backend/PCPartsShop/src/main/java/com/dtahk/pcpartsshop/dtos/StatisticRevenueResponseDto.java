package com.dtahk.pcpartsshop.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class StatisticRevenueResponseDto {
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date ngay;
    private Integer soLuongDonThanhCong;
    private Double tongTienHang;
    private Double tongChietKhau;
}
