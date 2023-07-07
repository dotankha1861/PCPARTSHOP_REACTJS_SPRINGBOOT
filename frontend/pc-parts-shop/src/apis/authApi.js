import {request} from "../utils/axios_helper";

export const login = ({username, password}) => {
    return request("post", "/signin", {username, password});
};

export const sendMessage = () => {
    return request("get", "/messages");
}

export const getText = () => {
    return request("get", "/test");
}