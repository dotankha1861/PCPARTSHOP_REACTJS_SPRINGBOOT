import { request } from "../../utils/axios_helper"

export const getAllSISheet = () => {
    return request("get", "/stock-inventory-sheet");
} 

export const createSISheet = (data) => {
    return request("post", "/stock-inventory-sheet", data);
}

export const getSISheetDetail = (id) => {
    return request("get", "/stock-inventory-sheet/" + id);
}