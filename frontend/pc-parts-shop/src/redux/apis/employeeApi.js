import { request } from "../../utils/axios_helper"


export const getAllEmployee = () => {
    return request("get", "/admin/employees");
}

export const createEmployee = (data) => {
    return request("post", "/admin/employees", data);
}

export const activeEmployee = ({employeeId, active}) => {
    return request("put", "/admin/employees/" + employeeId + "?active=" + active);
}

export const deleteEmployee = ({employeeId}) => {
    return request("delete", "/admin/employees/" + employeeId);
}

export const updateRole = ({employeeId, role}) => {
    return request("put", "/admin/employees/role/" + employeeId, {role} );
}