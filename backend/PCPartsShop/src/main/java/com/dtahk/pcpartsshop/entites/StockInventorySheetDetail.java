package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name="stock_inventory_sheet_details")
public class StockInventorySheetDetail {
    @EmbeddedId
    private StockInventorySheetDetailKey id;

    @ManyToOne
    @MapsId("stockInventorySheetId")
    @JoinColumn(name = "stock_inventory_sheet_id")
    private StockInventorySheet stockInventorySheet;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    @JoinColumn(name = "initial_quantity", nullable = false)
    private int initialQuantity;

    @JoinColumn(name = "actual_quantity", nullable = false)
    private int actualQuantity;
}
