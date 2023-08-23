package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.dtos.ProductResponseDto;
import com.dtahk.pcpartsshop.dtos.PromotionCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionResponseDto;
import com.dtahk.pcpartsshop.entites.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

}
