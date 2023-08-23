package com.dtahk.pcpartsshop.entites;

import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.StatisticRevenueResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Builder
@NamedNativeQuery(name="OrderDetail.getStatisticRevenue",
        resultSetMapping="Mapping.StatisticRevenueResponseDto",
        query="call sp_calculate_statistic_revenue(:dateFrom, :dateTo)")


@SqlResultSetMapping(name = "Mapping.StatisticRevenueResponseDto",
        classes = @ConstructorResult(targetClass = StatisticRevenueResponseDto.class,
                columns = {
                        @ColumnResult(name = "ngay", type = Date.class),
                        @ColumnResult(name = "soLuongDonThanhCong", type = Integer.class),
                        @ColumnResult(name ="tongTienHang", type = Double.class),
                        @ColumnResult(name = "tongChietKhau", type = Double.class)
                }))

@Table(name= "order_details")
public class OrderDetail {
    @EmbeddedId
    private OrderDetailKey id;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private double discount;
}
