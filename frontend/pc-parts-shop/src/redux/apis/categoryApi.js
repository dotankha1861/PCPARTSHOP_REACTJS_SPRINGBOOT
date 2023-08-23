import { request, requestFormData } from "../../utils/axios_helper"

export const getAllCategory = () => {
    return request("get","/categories");
}

export const createCategory = (data) => {
    return request("post", "/categories", data);
}

export const deleteCategory = (id) => {
    return request("delete", "/categories/" + id);
}

export const updateCategory = ({id, data}) => {
    console.log(data);
    data.forEach((value, key) => {
        console.log(key, value);
      });
    return request("put", "/categories/" + id, data);
}