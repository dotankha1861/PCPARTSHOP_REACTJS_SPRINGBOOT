package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.PromotionCreateRequestDto;
import com.dtahk.pcpartsshop.dtos.PromotionDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.PromotionResponseDto;
import com.dtahk.pcpartsshop.entites.Promotion;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.PromotionMapper;
import com.dtahk.pcpartsshop.repositories.PromotionRepository;
import com.dtahk.pcpartsshop.services.PromotionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionServiceImpl implements PromotionService {
    public static final String PROMOTION_NOT_EXIST = "Chương trình khuyến mãi không tồn tại";
    public static final String PROMOTION_APPLIED = "Khuyến mãi đã áp dụng không thể xóa";
    public static final String PROMOTION_NOT_YOUR = "Bạn không quản lý chương trình khuyến mãi này";
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;
    private final EmployeeServiceImpl employeeService;
    private final CategoryServiceImpl categoryService;

    @Override
    public List<PromotionResponseDto> getAllPromotion() {
        return promotionRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(
                (promotion) -> {
                    PromotionResponseDto promotionResponseDto = promotionMapper
                            .promotionToPromotionResponseDto(promotion);
                    User user = promotion.getEmployee().getUser();
                    promotionResponseDto.setCreatedId(promotion.getEmployee().getId());
                    promotionResponseDto.setCreatedName(user.getLastName() + " " + user.getFirstName());
                    return promotionResponseDto;
                }
        ).collect(Collectors.toList());
    }

    @Override
    public PromotionDetailResponseDto getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id).orElseThrow(() -> {
                    throw new AppException(PROMOTION_NOT_EXIST, HttpStatus.NOT_FOUND);
                }
        );
        PromotionDetailResponseDto foundPromotion = promotionMapper.promotionToPromotionDetailResponseDto(promotion);
        User user = promotion.getEmployee().getUser();
        foundPromotion.setCreatedId(promotion.getEmployee().getId());
        foundPromotion.setCreatedName(user.getLastName() + " " + user.getFirstName());
        foundPromotion.setListCategories(categoryService.getCategoriesByPromotion(promotion));
        return foundPromotion;
    }

    @Override
    public PromotionResponseDto createPromotion(PromotionCreateRequestDto promotionCreateRequestDto) {
        Promotion promotion = promotionMapper.promotionCreateRequestDtoToPromotion(promotionCreateRequestDto);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        promotion.setEmployee(employeeService.getEmployeeByUserId(((User) authentication.getPrincipal()).getId()));
        promotion.setCreatedAt(LocalDateTime.now());
        promotion.setListCategories(promotionCreateRequestDto.getListCategoriesId().stream()
                .map(categoryService::getCategoryById)
                .collect(Collectors.toList()));
        Promotion savedPromotion = promotionRepository.save(promotion);
        PromotionResponseDto promotionResponseDto = promotionMapper.promotionToPromotionResponseDto(savedPromotion);
        User user = promotion.getEmployee().getUser();
        promotionResponseDto.setCreatedId(promotion.getEmployee().getId());
        promotionResponseDto.setCreatedName(user.getLastName() + " " + user.getFirstName());
        return promotionResponseDto;
    }

    @Override
    @Transactional
    public void deletePromotion(Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId).orElseThrow(() -> {
            throw new AppException(PROMOTION_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if(promotion.getEffectiveDate().isBefore(LocalDateTime.now()))
            throw new AppException(PROMOTION_APPLIED, HttpStatus.EXPECTATION_FAILED);
        promotion.getListCategories().clear();
        promotionRepository.save(promotion);
        promotionRepository.delete(promotion);
    }

    @Override
    public PromotionResponseDto updatePromotion(PromotionCreateRequestDto promotionCreateRequestDto, Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId).orElseThrow(() -> {
            throw new AppException(PROMOTION_NOT_EXIST, HttpStatus.NOT_FOUND);
        });

        if (promotion.getEffectiveDate().isBefore(LocalDateTime.now()))
            throw new AppException(PROMOTION_APPLIED, HttpStatus.EXPECTATION_FAILED);
        promotionMapper.promotionCreateRequestDtoToPromotion(promotionCreateRequestDto, promotion);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = ((User) authentication.getPrincipal());
        if (!Objects.equals(employeeService.getEmployeeByUserId(user.getId()).getId(), promotion.getEmployee().getId()))
            throw new AppException(PROMOTION_NOT_YOUR, HttpStatus.EXPECTATION_FAILED);

        promotion.setListCategories(promotionCreateRequestDto.getListCategoriesId().stream()
                .map(categoryService::getCategoryById)
                .collect(Collectors.toList()));

        Promotion savedPromotion = promotionRepository.save(promotion);
        PromotionResponseDto promotionResponseDto = promotionMapper.promotionToPromotionResponseDto(savedPromotion);
        promotionResponseDto.setCreatedId(promotion.getEmployee().getId());
        promotionResponseDto.setCreatedName(user.getLastName() + " " + user.getFirstName());
        return promotionResponseDto;
    }

    @Override
    public PromotionResponseDto cancelPromotion(Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId).orElseThrow(() -> {
            throw new AppException(PROMOTION_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = ((User) authentication.getPrincipal());
        if (!Objects.equals(employeeService.getEmployeeByUserId(user.getId()).getId(), promotion.getEmployee().getId()))
            throw new AppException(PROMOTION_NOT_YOUR, HttpStatus.EXPECTATION_FAILED);
        promotion.setExpirationDate(LocalDateTime.now());
        Promotion savedPromotion = promotionRepository.save(promotion);
        PromotionResponseDto promotionResponseDto = promotionMapper.promotionToPromotionResponseDto(savedPromotion);
        promotionResponseDto.setCreatedId(promotion.getEmployee().getId());
        promotionResponseDto.setCreatedName(user.getLastName() + " " + user.getFirstName());
        return promotionResponseDto;
    }

}

