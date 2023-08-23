package com.dtahk.pcpartsshop.services;

import com.dtahk.pcpartsshop.dtos.SISheetDetailDto;
import com.dtahk.pcpartsshop.entites.StockInventorySheet;
import com.dtahk.pcpartsshop.entites.StockInventorySheetDetail;

import java.util.List;

public interface StockInventoryDetailService {
    public StockInventorySheetDetail save(StockInventorySheetDetail  stockInventorySheetDetail);

    List<StockInventorySheetDetail> findAllBySISheetSId(Long siSheetId);

}
