package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50, unique = true)
    private String name;

    @Column
    private String image;

    @Column(nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "category")
    private List<Product> listProducts;

    @ManyToMany(mappedBy = "listCategories")
    private List<Promotion> listPromotions;
}
