package com.dtahk.pcpartsshop.entites;

import com.dtahk.pcpartsshop.dtos.ProductDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@NamedNativeQuery(name="Product.getProductsWithDiscount",
        resultSetMapping="Mapping.ProductResponseDto",
        query="call sp_get_products_with_discount()")

@SqlResultSetMapping(name = "Mapping.ProductResponseDto",
        classes = @ConstructorResult(targetClass = ProductResponseDto.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "skuCode"),
                        @ColumnResult(name ="name"),
                        @ColumnResult(name = "image"),
                        @ColumnResult(name = "price"),
                        @ColumnResult(name ="quantity"),
                        @ColumnResult(name = "active", type = Boolean.class),
                        @ColumnResult(name ="discount"),
                        @ColumnResult(name = "categoryId"),

        }))
@NamedNativeQuery(name="Product.getProductWithDiscountBySkuCode",
        resultSetMapping="Mapping.ProductDetailResponseDto",
        query="call sp_get_product_with_discount_by_skuCode(:skuCode)")


@SqlResultSetMapping(name = "Mapping.ProductDetailResponseDto",
        classes = @ConstructorResult(targetClass = ProductDetailResponseDto.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "skuCode"),
                        @ColumnResult(name ="name"),
                        @ColumnResult(name = "image"),
                        @ColumnResult(name = "price"),
                        @ColumnResult(name ="quantity"),
                        @ColumnResult(name = "active", type = Boolean.class),
                        @ColumnResult(name ="discount"),
                        @ColumnResult(name = "shortDesc"),
                        @ColumnResult(name = "detailDesc"),
                        @ColumnResult(name = "categoryId"),
                }))


@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku_code", unique = true, length = 50)
    private String skuCode;

    @Column(nullable = false, unique = true, length = 200)
    private String name;

    private String image;

    @Column(nullable = false)
    private double price;

    @Column(name ="quantity" , nullable = false)
    private int quantity;

    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "short_desc", nullable = false)
    private String shortDesc;

    @Column(name="detail_desc", columnDefinition = "TEXT")
    private String detailDesc;

    @ManyToOne
    @JoinColumn(name="category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "product")
    private List<OrderDetail> orderDetails;

    @OneToMany(mappedBy = "product")
    private List<StockInventorySheetDetail> listStockInventorySheetDetail;

}
