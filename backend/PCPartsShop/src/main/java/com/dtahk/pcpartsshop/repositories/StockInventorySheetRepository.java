package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.StockInventorySheet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockInventorySheetRepository extends JpaRepository<StockInventorySheet, Long> {

}
