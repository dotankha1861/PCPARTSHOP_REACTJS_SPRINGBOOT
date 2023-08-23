package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.entites.StockInventorySheet;
import com.dtahk.pcpartsshop.entites.StockInventorySheetDetail;
import com.dtahk.pcpartsshop.repositories.StockInventorySheetDetailRepository;
import com.dtahk.pcpartsshop.services.StockInventoryDetailService;
import com.dtahk.pcpartsshop.services.StockInventorySheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockInventorySheetDetailServiceImpl implements StockInventoryDetailService {
    private final StockInventorySheetDetailRepository stockInventorySheetDetailRepository;

    @Override
    public StockInventorySheetDetail save(StockInventorySheetDetail stockInventorySheetDetail) {
        return stockInventorySheetDetailRepository.save(stockInventorySheetDetail);
    }

    @Override
    public List<StockInventorySheetDetail> findAllBySISheetSId(Long siSheetId) {
        return stockInventorySheetDetailRepository.findAllByStockInventorySheetId(siSheetId);
    }
}
