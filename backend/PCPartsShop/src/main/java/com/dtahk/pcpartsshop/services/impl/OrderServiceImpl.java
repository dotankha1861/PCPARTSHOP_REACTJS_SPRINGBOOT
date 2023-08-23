package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.commons.OrderStatus;
import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.*;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.OrderMapper;
import com.dtahk.pcpartsshop.repositories.OrderDetailRepository;
import com.dtahk.pcpartsshop.repositories.OrderRepository;
import com.dtahk.pcpartsshop.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    public static final String ORDER_NOT_FOUND = "Đơn hàng không tồn tại";
    public static final String ORDER_NOT_EXIST = "Đơn hàng không tồn tại";
    public static final String ORDER_NOT_YOURS = "Đơn hàng này đã được nhân viên khác duyệt";
    public static final String ORDER_HAS_APPROVED = "Đơn hàng đã được duyệt không thể hủy";
    public static final String ORDER_FINISHED_NOT_UPDATE = "Đơn hàng đã giao thành công không thể cập nhật";
    public static final String ORDER_CANCELED_NOT_UPDATE = "Đơn hàng đã hủy không thể cập nhật";
    private final OrderRepository orderRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    private final OrderDetailService orderDetailService;
    private final OrderMapper orderMapper;
    private final EmployeeService employeeService;


    @Transactional
    public OrderResponseDto createOrder(OrderCreateRequestDto orderCreateRequestDto){
        Order order = orderMapper.orderCreateRequestDtoToOrder(orderCreateRequestDto);
        order.setCreatedAt(LocalDateTime.now());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        order.setCustomer(customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId()));
        order.setStatus(OrderStatus.CHOXACNHAN);
        orderRepository.save(order);

        orderCreateRequestDto.getOrderDetails().forEach((orderDetail -> {
            OrderDetail orderDetail1 = orderMapper.orderDetailDtoToOrderDetail(orderDetail);
            orderDetail1.setOrder(order);
            orderDetail1.setProduct(productService.getProductBySkuCode(orderDetail.getSkuCode()));
            orderDetail1.setId(OrderDetailKey.builder()
                    .orderId(order.getId())
                    .productId(orderDetail1.getProduct().getId())
                    .build()
            );
            orderDetailService.save(orderDetail1);
        }));

        OrderResponseDto orderResponseDto = orderMapper.orderToOrderResponseDto(order);
        orderResponseDto.setCustomerId(order.getCustomer().getId());

        return  orderResponseDto;
    }

    public List<OrderResponseDto> getAllOrder(){
//        Sort.by(Sort.Direction.DESC,"createdAt")
        return orderRepository.findAll().stream().map(order -> {
            OrderResponseDto orderResponseDto = orderMapper.orderToOrderResponseDto(order);
            orderResponseDto.setCustomerId(order.getCustomer().getId());
            orderResponseDto.setCustomerName(order.getCustomer().getUser().getLastName() + " "
            + order.getCustomer().getUser().getFirstName());
            if(order.getEmployee()!=null) {
                orderResponseDto.setEmployeeId(order.getEmployee().getId());
                orderResponseDto.setEmployeeName(order.getEmployee().getUser().getLastName() +" "
                +order.getEmployee().getUser().getFirstName());
            }
            return orderResponseDto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> {
            throw new AppException(ORDER_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        orderDetailService.getAllByOrderId(id).forEach(item -> {
            if(item.getProduct().getQuantity() - item.getQuantity() < 0)
                throw new AppException(item.getProduct().getSkuCode() + " - " + item.getProduct().getName() +
                                        " chỉ còn " + item.getProduct().getQuantity() + "sản phẩm", HttpStatus.EXPECTATION_FAILED);
            else if(item.getProduct().getQuantity() - item.getQuantity() == 0)
                throw new AppException("Sản phẩm " + item.getProduct().getSkuCode() + " - " + item.getProduct().getName() + " đã hết hàng",
                        HttpStatus.EXPECTATION_FAILED);
            productService.updateQuantity(item.getProduct().getId(), - item.getQuantity());
        });
        order.setStatus(OrderStatus.XACNHAN);
        order.setEmployee(employeeService.getEmployeeByUserId(((User) authentication.getPrincipal()).getId()));
        orderRepository.save(order);
        orderDetailService.getAllByOrderId(id).forEach(item -> {
            productService.updateQuantity(item.getProduct().getId(), - item.getQuantity());
        });

    }

    @Override
    public List<OrderCustomerResponseDto> getAllOrderCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Customer customer = customerService.getCustomerByUserId(((User) authentication.getPrincipal()).getId());
        return orderRepository.findAllByCustomerId(customer.getId()).stream().map(order -> {
            OrderCustomerResponseDto orderCustomerResponseDto = orderMapper
                    .orderToOrderCustomerResponseDto(order);
            List<OrderDetail> orderDetailList = orderDetailService.getAllByOrderId(order.getId());
            orderCustomerResponseDto.setQuantityProduct(orderDetailList.size());
            orderCustomerResponseDto.setFirstProductImage(orderDetailList.get(0).getProduct().getImage());
            orderCustomerResponseDto.setFirstProductName(orderDetailList.get(0).getProduct().getName());
            orderCustomerResponseDto.setTotal(orderDetailList.stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity()).sum());
            return orderCustomerResponseDto;
        }).sorted(Comparator.comparing(OrderCustomerResponseDto::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Order order = orderRepository.findById(orderId).orElseThrow(()-> {
            throw new AppException(ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
        });
        if(user.getRole() == UserRole.CUSTOMER){
            if(!Objects.equals(order.getCustomer().getId(), customerService.getCustomerByUserId(user.getId()).getId())){
                throw new AppException(ORDER_NOT_YOURS, HttpStatus.NOT_ACCEPTABLE);
            }
            if(order.getStatus() != OrderStatus.CHOXACNHAN){
                throw new AppException(ORDER_HAS_APPROVED, HttpStatus.EXPECTATION_FAILED);
            }
        }
        else{
            Employee employee = employeeService.getEmployeeByUserId(user.getId());
            if(order.getEmployee() != null && !Objects.equals(order.getEmployee().getId(), employee.getId())){
                throw new AppException(ORDER_NOT_YOURS, HttpStatus.NOT_ACCEPTABLE);
            }
            order.setEmployee(employee);

        }
        order.setStatus(OrderStatus.DAHUY);
        orderRepository.save(order);
    }

    @Override
    public List<OrderDetailResponseDto> getOrderDetailByOrderId(Long orderId) {
        return orderDetailService.getAllByOrderId(orderId).stream()
                .map(orderMapper::orderDetailToOrderDetailResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateStatusOrder(Long orderId, OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> {
            throw new AppException(ORDER_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if(order.getStatus() == OrderStatus.HOANTAT)
            throw new AppException(ORDER_FINISHED_NOT_UPDATE, HttpStatus.EXPECTATION_FAILED);
        else if (order.getStatus() == OrderStatus.DAHUY)
            throw new AppException(ORDER_CANCELED_NOT_UPDATE, HttpStatus.EXPECTATION_FAILED);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        if(!Objects.equals(order.getEmployee().getId(), employeeService.getEmployeeByUserId(user.getId()).getId()))
            throw new AppException(ORDER_NOT_YOURS, HttpStatus.EXPECTATION_FAILED);

        order.setStatus(orderStatus);
        orderRepository.save(order);
        if(order.getStatus() == OrderStatus.DAHUY) orderDetailService.getAllByOrderId(orderId).forEach(item -> {
            productService.updateQuantity(item.getProduct().getId(), item.getQuantity());
        });
    }

    @Override
    public List<StatisticRevenueResponseDto> statisticRevenue(StatisticRevenueRequestDto statisticRevenueRequestDto) {
        return orderDetailService
                .statisticRevenue(statisticRevenueRequestDto.getDateFrom()
                , statisticRevenueRequestDto.getDateTo());
    }
}
