package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedStoredProcedureQueries;
import jakarta.persistence.NamedStoredProcedureQuery;

public class ProductWithDiscount {
    private Long id;
    private String sku_code;
    private String name;
    private String image;
    private Double price;
    private Integer quantity;
    private Double discount;
}
