package com.dtahk.pcpartsshop.entites;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "json")
    private String data;
}