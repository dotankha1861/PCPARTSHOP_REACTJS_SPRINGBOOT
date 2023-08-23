package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.SISheetDetailDto;
import com.dtahk.pcpartsshop.dtos.SISheetDetailResponseDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetRequestDto;
import com.dtahk.pcpartsshop.dtos.StockInventorySheetResponseDto;
import com.dtahk.pcpartsshop.entites.*;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.StockInventorySheetMapper;
import com.dtahk.pcpartsshop.repositories.StockInventorySheetRepository;
import com.dtahk.pcpartsshop.services.EmployeeService;
import com.dtahk.pcpartsshop.services.ProductService;
import com.dtahk.pcpartsshop.services.StockInventoryDetailService;
import com.dtahk.pcpartsshop.services.StockInventorySheetService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockInventorySheetServiceImpl implements StockInventorySheetService {
    private final StockInventorySheetRepository stockInventorySheetRepository;
    private final StockInventorySheetMapper stockInventorySheetMapper;
    private final ProductService productService;

    private final StockInventoryDetailService stockInventoryDetailService;

    protected final EmployeeService employeeService;

    @Override
    @Transactional
    public StockInventorySheetResponseDto createStockInventorySheet(StockInventorySheetRequestDto stockInventorySheetRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeService.getEmployeeByUserId(user.getId());
        StockInventorySheet stockInventorySheet = stockInventorySheetMapper
                .SISheetRequestDtoToSISheet(stockInventorySheetRequestDto);
        stockInventorySheet.setCreatedAt(LocalDateTime.now());
        stockInventorySheet.setEmployee(employee);
        StockInventorySheet savedSISheet = stockInventorySheetRepository.save(stockInventorySheet);

        stockInventorySheetRequestDto.getSheetDetails().forEach(siSheetDetailDto -> {
            Product product =productService.getProductById(siSheetDetailDto.getProductId());
            if(product.getQuantity() + siSheetDetailDto.getActualQuantity() - siSheetDetailDto.getInitialQuantity() < 0)
                throw new AppException(product.getSkuCode() + " - " + product.getName() +
                        " chỉ hiện còn " + product.getQuantity() + " sản phẩm được ghi nhận", HttpStatus.EXPECTATION_FAILED);

            StockInventorySheetDetail stockInventorySheetDetail = StockInventorySheetDetail.builder()
                    .id(StockInventorySheetDetailKey.builder()
                            .stockInventorySheetId(savedSISheet.getId())
                            .productId(siSheetDetailDto.getProductId()).build())
                    .product(product)
                    .stockInventorySheet(savedSISheet)
                    .initialQuantity(siSheetDetailDto.getInitialQuantity())
                    .actualQuantity(siSheetDetailDto.getActualQuantity())
                    .build();
            stockInventoryDetailService.save(stockInventorySheetDetail);
            productService.updateQuantity(siSheetDetailDto.getProductId(),
                    siSheetDetailDto.getActualQuantity() - siSheetDetailDto.getInitialQuantity());
        });
        StockInventorySheetResponseDto stockInventorySheetResponseDto = stockInventorySheetMapper
                .SISheetToSISheetResponseDto(savedSISheet);
        stockInventorySheetResponseDto.setEmployeeId(employee.getId());
        stockInventorySheetResponseDto.setEmployeeName(employee.getUser().getLastName() + " " + employee.getUser().getFirstName());
        stockInventorySheetResponseDto.setQuantityProduct(stockInventorySheetRequestDto.getSheetDetails().size());
        stockInventorySheetResponseDto.setDifference(stockInventorySheetRequestDto.getSheetDetails()
                .stream().mapToInt(item -> item.getActualQuantity() - item.getInitialQuantity())
                .sum());
        return stockInventorySheetResponseDto;
    }

    @Override
    public List<StockInventorySheetResponseDto> getAllStockInventorySheet() {
        return stockInventorySheetRepository.findAll(Sort.by(Sort.Direction.DESC,"createdAt"))
                .stream().map(stockInventorySheet -> {
                    StockInventorySheetResponseDto stockInventorySheetResponseDto = new StockInventorySheetResponseDto();
                    stockInventorySheetResponseDto.setEmployeeId(stockInventorySheet.getEmployee().getId());
                    stockInventorySheetResponseDto.setId(stockInventorySheet.getId());
                    stockInventorySheetResponseDto.setCreatedAt(stockInventorySheet.getCreatedAt());
                    stockInventorySheetResponseDto.setEmployeeName(stockInventorySheet.getEmployee().getUser().getLastName() + " "
                            + stockInventorySheet.getEmployee().getUser().getFirstName());
                    List<StockInventorySheetDetail> detailList = stockInventoryDetailService.findAllBySISheetSId(stockInventorySheet.getId());
                    stockInventorySheetResponseDto.setQuantityProduct(detailList.size());
                    stockInventorySheetResponseDto.setDifference(detailList
                            .stream().mapToInt(item -> item.getActualQuantity() - item.getInitialQuantity())
                            .sum());
                    return stockInventorySheetResponseDto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<SISheetDetailResponseDto> getStockInventorySheetDetailBySISId(Long sisId) {
        return stockInventoryDetailService.findAllBySISheetSId(sisId).stream().map(stockInventorySheetDetail ->
            SISheetDetailResponseDto.builder()
                    .productId(stockInventorySheetDetail.getId().getProductId())
                    .productName(stockInventorySheetDetail.getProduct().getName())
                    .actualQuantity(stockInventorySheetDetail.getActualQuantity())
                    .initialQuantity(stockInventorySheetDetail.getInitialQuantity())
                    .skuCode(stockInventorySheetDetail.getProduct().getSkuCode())
                    .image(stockInventorySheetDetail.getProduct().getImage())
                    .build()
        ).collect(Collectors.toList());
    }
}
