import { request } from "../../utils/axios_helper"

export const getAllCustomer = () => {
    return request("get", "/customers");
}

export const activeCustomer = ({customerId, active}) => {
    return request("put", "/customers/" + customerId + "?active=" + active);
}

export const deleteCustomer = ({customerId}) => {
    return request("delete", "/customers/" + customerId);
} 