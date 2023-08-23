import {createSlice} from "@reduxjs/toolkit"
import { setAuthHeader } from "../../utils/axios_helper";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentUser: null,
        isFetching: false,
    },
    reducers: {
        registerStart: (state) => {
            state.isFetching = true;
        },
        registerSuccess: (state) => {
            state.isFetching = false;
        },
        registerFailed: (state) => {
            state.isFetching = false;
        },
        loginStart: (state) => {
            state.isFetching = true;
        },
        reset: (state) => {
            state.isFetching = false;
        },
        loginSuccess: (state, action) => {
            const {data} = action.payload;
            const {token, userDetail} = data;
            state.isFetching = false;
            state.currentUser = userDetail; 
            setAuthHeader(token);
        },
        loginFailed: (state, action) => {
            state.isFetching = false;
        },
        logoutStart: (state) => {
            state.isFetching = false;
        },
        logoutSuccess: (state) => {
            state.currentUser = null;
            state.isFetching = false;
            setAuthHeader(null);
        },
        logoutFailed: (state) => {
            state.isFetching = false;
        },
        changePasswordStart: (state) => {
            state.isFetching =  true;
        },
        changePasswordSuccess: (state) => {
        },
        updateProfileCustomerStart: (state) => {
            state.isFetching = true;
        },
        updateProfileCustomerSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload.data;
        },
        updateProfileEmplyeeStart: (state) => {
            state.isFetching = true;
        },
        updateProfileEmployeeSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload.data;
        }
    } 
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    updateProfileCustomerStart,
    updateProfileCustomerSuccess,
    updateProfileEmplyeeStart,
    updateProfileEmployeeSuccess
} = authSlice.actions;
export default authSlice.reducer;
