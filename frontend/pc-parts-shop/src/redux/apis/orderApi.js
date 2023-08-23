import { request } from "../../utils/axios_helper"
export const createOrder = (data) => {
    return request("post", "/orders", data);
}

export const getAllOrder = () => {
    return request("get", "/orders");
}

export const approveOrder = (id) => {
    console.log("id: " + id);
    return request("put", "/orders/approve/" + id);
}

export const getAllOrderByCustomerId = () => {
    return request("get", "/orders/customer");
}

export const cancelOrder = (id) => {
    return request("delete", "/orders/" + id);
}


export const getOrderDetailsByOrderId = (id) => {
    return request("get", "/orders/" + id);
}

export const updateStatusOrder = ({orderId, status}) => {
    return request("put", "/orders/status/" + orderId, {status})
}

export const getStatisticRevenue = ({dateFrom, dateTo}) => {
    return request("post", "/orders/statistic-revenue", ({dateFrom, dateTo}));
}