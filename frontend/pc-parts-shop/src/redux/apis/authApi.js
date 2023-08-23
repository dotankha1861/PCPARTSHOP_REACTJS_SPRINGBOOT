import {request} from "../../utils/axios_helper";

export const login = (requestLogin) => {
    return request("post", "/signin", requestLogin);
};

export const register = (requestRegister) => {
    return request("post", "/register", requestRegister)
}

export const logout = () => {
    return request("post", "/signout");
}

export const changePassword = (data) => {
    return request("post", "/password", data);
}

export const updateProfileCustomer = (data) => {
    return request("post", "/customers", data);
} 

export const updateProfileEmployee = (data) => {
    return request("put", "/admin/employees", data);
}