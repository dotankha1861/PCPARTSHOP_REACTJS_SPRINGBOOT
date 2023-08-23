package com.dtahk.pcpartsshop.services.impl;

import com.dtahk.pcpartsshop.dtos.*;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.exceptions.AppException;
import com.dtahk.pcpartsshop.mappers.EmployeeMapper;
import com.dtahk.pcpartsshop.mappers.UserMapper;
import com.dtahk.pcpartsshop.repositories.EmployeeRepository;
import com.dtahk.pcpartsshop.services.EmployeeService;
import com.dtahk.pcpartsshop.services.ImageService;
import com.dtahk.pcpartsshop.services.UserService;
import com.dtahk.pcpartsshop.utils.UploadFileUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    public static final String EMPLOYEE_NOT_EXIST = "Nhân viên không tồn tại";
    public static final String PATH_IMAGE_EMPLOYEES = "employees/";
    public static final String EMPLOYEE_NOT_YOUR = "Bạn không quản lý nhân viên này";
    public static final String EMPLOYEE_WORKED_NOT_DELETE = "Nhân viên đã làm việc khoogn thể xóa";
    public static final String EMPLOYEE_WORKED = "Nhân viên đã có hoạt động không thể xóa";
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final UserService userService;
    private final ImageService imageService;

    @Override
    public void deleteEmployee(Long employeeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> {
            throw new AppException(EMPLOYEE_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        Employee employee1 = getEmployeeByUserId(user.getId());
        if (!Objects.equals(employee.getEmployee().getId(), employee1.getId())) {
            throw new AppException(EMPLOYEE_NOT_YOUR, HttpStatus.EXPECTATION_FAILED);
        }

        try {
            employeeRepository.deleteById(employeeId);
        }
        catch (Exception ex){
            throw new AppException(EMPLOYEE_WORKED, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @Override
    public Employee getEmployeeByUserId(Long id) {
        Optional<Employee> employee = employeeRepository.findByUserId(id);
        throwIfEmployeeNotExist(employee);
        return employee.get();
    }

    public List<EmployeeResponseDto> getAllEmployee() {
        List<Employee> employeeList = employeeRepository.findAll(Sort.by(Sort.Direction.DESC, "user.createdAt"));
        return employeeList.stream()
                .map(employeeMapper::employeeToEmployeeResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Employee createEmployee(EmployeeRequestDto employeeRequestDto) {
        UserRequestDto userRequestDto = employeeMapper.employeeRequestDtoToUserRequestDto(employeeRequestDto);
        User user = userService.createUser(userRequestDto);
        Employee employee = employeeMapper.employeeRequestDtoToEmployee(employeeRequestDto);
        if (employeeRequestDto.getImage() != null) {
            String uri = PATH_IMAGE_EMPLOYEES + UUID.randomUUID();
            imageService.saveImage(employeeRequestDto.getImage(), uri + ".jpg");
            employee.setAvatar(UploadFileUtil.URL + uri);
        }
        employee.setUser(user);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        employee.setEmployee(getEmployeeByUserId(((User) authentication.getPrincipal()).getId()));
        return employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public EmployeeResponseDto updateProfileEmployee(ProfileEmployeeRequestDto profileEmployeeRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Employee employee = employeeRepository.findByUserId(user.getId()).orElseThrow(() -> {
            throw new AppException(EMPLOYEE_NOT_EXIST, HttpStatus.NOT_FOUND);
        });

        user.setFirstName(profileEmployeeRequestDto.getFirstName());
        user.setLastName(profileEmployeeRequestDto.getLastName());
        user.setSex(profileEmployeeRequestDto.isMale());
        user.setEmail(profileEmployeeRequestDto.getEmail());
        user.setPhone(profileEmployeeRequestDto.getPhone());
        userService.save(user);

        if (profileEmployeeRequestDto.getImage() != null) {
            if (employee.getAvatar() != null) {
                imageService.deleteImage(employee.getAvatar().split(UploadFileUtil.URL)[1] + ".jpg");
            }
            String uri = PATH_IMAGE_EMPLOYEES + UUID.randomUUID();
            imageService.saveImage(profileEmployeeRequestDto.getImage(), uri + ".jpg");
            employee.setAvatar(UploadFileUtil.URL + uri);
        }
        employee.setUser(user);
        Employee employee1 = employeeRepository.save(employee);
        return employeeMapper.employeeToEmployeeResponseDto(employee1);
    }

    @Override
    public void activeEmployee(Long employeeId, Boolean active) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Employee employee = getEmployeeByUserId(user.getId());
        Employee employee1 = employeeRepository.findById(employeeId).orElseThrow(() -> {
            throw new AppException(EMPLOYEE_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if (!Objects.equals(employee1.getEmployee().getId(), employee.getId())) {
            throw new AppException(EMPLOYEE_NOT_YOUR, HttpStatus.EXPECTATION_FAILED);
        }
        employee1.getUser().setActive(active);
        userService.save(employee1.getUser());
    }

    @Override
    public void updateRole(Long employeeId , UpdateRoleRequestDto updateRoleRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        Employee employee = getEmployeeByUserId(user.getId());
        Employee employee1 = employeeRepository.findById(employeeId).orElseThrow(() -> {
            throw new AppException(EMPLOYEE_NOT_EXIST, HttpStatus.NOT_FOUND);
        });
        if (!Objects.equals(employee1.getEmployee().getId(), employee.getId())) {
            throw new AppException(EMPLOYEE_NOT_YOUR, HttpStatus.EXPECTATION_FAILED);
        }
        User foundUser = employee1.getUser();
        foundUser.setRole(updateRoleRequestDto.getRole());
        userService.save(foundUser);
    }


    private static void throwIfEmployeeNotExist(Optional<Employee> employee) {
        if (employee.isEmpty()) throw new AppException(EMPLOYEE_NOT_EXIST, HttpStatus.NOT_FOUND);
    }
}

