package com.dtahk.pcpartsshop.controllers;

import com.dtahk.pcpartsshop.commons.RespBody;
import com.dtahk.pcpartsshop.commons.UserRole;
import com.dtahk.pcpartsshop.dtos.EmployeeRequestDto;
import com.dtahk.pcpartsshop.dtos.EmployeeResponseDto;
import com.dtahk.pcpartsshop.dtos.ProfileEmployeeRequestDto;
import com.dtahk.pcpartsshop.dtos.UpdateRoleRequestDto;
import com.dtahk.pcpartsshop.entites.Employee;
import com.dtahk.pcpartsshop.entites.User;
import com.dtahk.pcpartsshop.mappers.EmployeeMapper;
import com.dtahk.pcpartsshop.services.EmployeeService;
import jakarta.validation.Valid;
import jdk.jfr.ContentType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.TestOnly;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.net.URI;
import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/admin/employees")
public class EmployeeController {
    public static final String GET_ALL_EMPLOYEE_SUCCESSFULLY = "Lấy danh sách nhân viên thành công";
    public static final String CREATE_EMPLOYEE_SUCCESSFULLY = "Tạo nhân viên thành công";
    public static final String UPDATE_PROFILE_SUCCESSFULLY = "Cập nhật thông tin cá nhân thành công";
    public static final String BLOCK_EMPLOYEE_SUCCESSFULLY = "Khóa tài khoản nhân vin thành công";
    public static final String UNBLOCK_EMPLOYEE_SUCCESSFULLY = "Mở lại tài khoản cho nhân viên thành công";
    public static final String DELETE_EMPLOYEE_SUCCESSfULLY = "Xóa nhân vin thành công";
    public static final String UPDATE_ROLE_SUCCESSFULLY = "Cập nhật quyền thành công người dùng #";
    private final EmployeeService employeeService;

    private final EmployeeMapper employeeMapper;

    @GetMapping
    public ResponseEntity<RespBody> getAllEmployee(){
        List<EmployeeResponseDto> employeeResponseDtoList = employeeService.getAllEmployee();
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(GET_ALL_EMPLOYEE_SUCCESSFULLY)
                .data(employeeResponseDtoList)
                .build()
        );
    }

    @PostMapping( consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ResponseEntity<RespBody> createEmployee(@ModelAttribute @Valid EmployeeRequestDto employeeRequestDto){
        Employee employee = employeeService.createEmployee(employeeRequestDto);
        EmployeeResponseDto employeeResponseDto = employeeMapper.employeeToEmployeeResponseDto(employee);
        return ResponseEntity.created(URI.create("/admin/employees/" + employee.getId()))
                .body(RespBody.builder()
                        .status(HttpStatus.CREATED.value())
                        .message(CREATE_EMPLOYEE_SUCCESSFULLY)
                        .data(employeeResponseDto)
                        .build())
                ;
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RespBody> updateProfileEmployee(@ModelAttribute ProfileEmployeeRequestDto profileEmployeeRequestDto){
        EmployeeResponseDto employeeResponseDto = employeeService
                .updateProfileEmployee(profileEmployeeRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_PROFILE_SUCCESSFULLY)
                .data(employeeResponseDto)
                .build()
        );
    }


    @PutMapping("/{employeeId}")
    public ResponseEntity<RespBody> activeEmployee(@PathVariable Long employeeId, @RequestParam("active") Boolean active){
        employeeService.activeEmployee(employeeId, active);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(active ? BLOCK_EMPLOYEE_SUCCESSFULLY : UNBLOCK_EMPLOYEE_SUCCESSFULLY)
                .build()
        );
    }

    @DeleteMapping("/{employeeId}")
    public  ResponseEntity<RespBody> deleteEmployee(@PathVariable Long employeeId){
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(DELETE_EMPLOYEE_SUCCESSfULLY)
                .build()
        );
    }

    @PutMapping("/role/{employeeId}")
    public ResponseEntity<RespBody> updateRole(@PathVariable Long employeeId,
                                               @RequestBody UpdateRoleRequestDto updateRoleRequestDto){
        employeeService.updateRole(employeeId, updateRoleRequestDto);
        return ResponseEntity.ok(RespBody.builder()
                .status(HttpStatus.OK.value())
                .message(UPDATE_ROLE_SUCCESSFULLY + employeeId)
                .build()
        );
    }

}
