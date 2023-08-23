package com.dtahk.pcpartsshop.repositories;

import com.dtahk.pcpartsshop.entites.Category;
import com.dtahk.pcpartsshop.entites.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);

    List<Category> findByListPromotions(Promotion promotion);

}
