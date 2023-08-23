package com.dtahk.pcpartsshop.entites;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import javax.annotation.processing.Generated;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "customers")
public class Customer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "customer")
    private List<CartItem> cartItems;

    @OneToMany(mappedBy = "customer", fetch = FetchType.EAGER ,cascade = CascadeType.ALL)
    private List<Order> listOrders;

}
