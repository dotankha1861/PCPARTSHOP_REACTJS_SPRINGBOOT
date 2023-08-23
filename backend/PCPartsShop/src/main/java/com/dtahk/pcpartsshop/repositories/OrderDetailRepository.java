package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.dtos.StatisticRevenueResponseDto;
import com.dtahk.pcpartsshop.entites.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> getAllByOrderId(Long id);

    boolean existsByProductId(Long productId);

    void deleteAllByProductId(Long productId);

    @Query(nativeQuery = true)
    List<StatisticRevenueResponseDto> getStatisticRevenue(@Param("dateFrom") Date dateFrom,
                                                          @Param("dateTo") Date dateTo);
}
