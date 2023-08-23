package com.dtahk.pcpartsshop.repositories;


import com.dtahk.pcpartsshop.entites.StockInventorySheetDetail;
import com.dtahk.pcpartsshop.entites.StockInventorySheetDetailKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockInventorySheetDetailRepository extends JpaRepository<StockInventorySheetDetail, StockInventorySheetDetailKey> {
    List<StockInventorySheetDetail> findAllByStockInventorySheetId(Long SISheetId);
}
