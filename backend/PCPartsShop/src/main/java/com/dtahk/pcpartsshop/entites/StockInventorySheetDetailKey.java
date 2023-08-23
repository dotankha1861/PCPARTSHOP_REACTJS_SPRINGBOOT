package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StockInventorySheetDetailKey implements Serializable {
    @Column(name= "stock_inventory_sheet_id")
    private Long stockInventorySheetId;

    @Column(name = "product_id")
    private Long productId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StockInventorySheetDetailKey that = (StockInventorySheetDetailKey) o;
        return Objects.equals(stockInventorySheetId, that.stockInventorySheetId) && Objects.equals(productId, that.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(stockInventorySheetId, productId);
    }
}
