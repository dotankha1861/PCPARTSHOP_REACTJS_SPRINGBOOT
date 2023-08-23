import { request } from "../../utils/axios_helper";

export const getAllProduct = () => {
    return request("get", "/products");
}

export const getProductBySkuCode = (skuCode) => {
    return request("get", "/products/" + skuCode);
}

export const createProduct = (data) => {
    return request("post", "/products", data);
}

export const deleteProduct = (productId) => {
    return request("delete", "/products/" + productId);
}

export const updateProduct = ({productId, data}) => {
    return request("put", "/products/" + productId, data)
}