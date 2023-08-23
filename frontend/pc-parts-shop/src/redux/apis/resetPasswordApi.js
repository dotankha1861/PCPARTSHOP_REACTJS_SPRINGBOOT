import { request } from "../../utils/axios_helper"


export const forgetPassword = (email) => {
    return request("get", "/forget-password/" + email);
}

export const validateToken = (token) => {
    return request("post", "/validate-reset-token", {token})
}

export const resetPassword = (data) => {
    return request("post", "/reset-password", data);
}