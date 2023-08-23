import { request } from "../../utils/axios_helper"

export const createPromotion = (data) => {
    return request("post", "/promotions", data);
}

export const getAllPromotion = () => {
    return request("get", "/promotions");
}

export const getPromotionById = (id) => {
    return request("get", "/promotions/" + id);
}

export const deletePromotion = (id) => {
    return request("delete", "/promotions/" + id);
}

export const cancelPromotion = (id) => {
    return request("put", "/promotions/cancel/" + id)
}

export const updatePromotion = ({id, data}) => {
    return request("put", "/promotions/" + id , data);
}