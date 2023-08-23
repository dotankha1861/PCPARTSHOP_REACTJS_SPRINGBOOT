package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String avatar;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private Employee employee;

    @OneToMany(mappedBy = "employee")
    private List<Order> listOrders;

    @OneToMany(mappedBy = "employee")
    private List<Promotion> listPromotions;

    @OneToMany(mappedBy = "employee")
    private List<StockInventorySheet> listStockInventorySheets;
}