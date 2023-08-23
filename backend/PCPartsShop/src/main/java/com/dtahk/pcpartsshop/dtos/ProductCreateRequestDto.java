package com.dtahk.pcpartsshop.dtos;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProductCreateRequestDto {
    private String skuCode;
    private String name;
    private MultipartFile image;
    private double price;
//    private int quantity;
    private String shortDesc;
    private String detailDesc;
    private Long categoryId;
}
