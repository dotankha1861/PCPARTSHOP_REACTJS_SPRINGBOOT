import { request } from "../../utils/axios_helper";

export const addToCart = (data) => {
    return request("post","/carts", data);
}

export const deleteFromCart = (skuCode) => {
    return request("delete","/carts/" + skuCode);
}

export const getAllCartItem = () => {
    return request("get","/carts");
}

export const updateCartItem = (data) => {
    return request("put", "/carts", data);
}

export const refreshCart = () => {
    return request("delete", "/carts/refresh");
}

export const mergeCartItem = (data) => {
    return request("put", "/carts/merge", data);
}