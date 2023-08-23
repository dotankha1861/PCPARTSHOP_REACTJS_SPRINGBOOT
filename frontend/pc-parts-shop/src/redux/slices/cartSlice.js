import {createSlice, current} from "@reduxjs/toolkit"
import { setAuthHeader } from "../../utils/axios_helper";
import { act } from "react-dom/test-utils";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        currentCart: [],
        isFetching: false,
    },
    reducers: {
        getAllCartItemStart: (state) => {
            state.isFetching = true;
        },
        getAllCartItemSuccess: (state, action) => {
            state.isFetching = false;
            const {data} = action.payload;
            state.currentCart = data;
        },
        addToCartStart: (state) => {
            state.isFetching = true;
        },
        addToCartSuccess: (state, action) => {
            state.isFetching = false;
            const {skuCode, quantity} = action.payload;
            state.currentCart = [...state.currentCart, {skuCode, quantity}]
        },
        updateCartStart: (state) => {
            state.isFetching = true;
        },
        updateCartSuccess: (state, action) => {
            state.isFetching = false;
            const {skuCode, quantity} = action.payload;
            state.currentCart = state.currentCart.map(item => item.skuCode === skuCode ? {...item, quantity} : item);
        },
        deleteCartStart: (state) => {
            state.isFetching = false;
        },
        deleteCartSuccess: (state, action) => {
            state.isFetching = true;
            const {skuCode} = action.payload;
            state.currentCart = state.currentCart.filter(item => item.skuCode !== skuCode);
        },
        mergeCartItemStart: (state) => {
            state .isFetching = true;
        },
        mergeCartItemSuccess: (state, action) => {
            state.isFetching = false;
        },
        resetCart: (state) => {
            state.isFetching = false;
            state.currentCart = []
        },
        refreshCartStart: (state) => {
            state.isFetching = true;
        }
        // reset: (state) => {
        //     state.isFetching = false;
        // },
        // loginSuccess: (state, action) => {
        //     const {data} = action.payload;
        //     const {token, userDetail} = data;
        //     state.isFetching = false;
        //     state.currentUser = userDetail; 
        //     setAuthHeader(token);
        // },
        // loginFailed: (state, action) => {
        //     state.isFetching = false;
        // },
        // addToCartStart: (state) => {
        //     state.isFetching = false;
        // },
        // addToCartSuccess: (state) => {
        //     state.currentUser = null;
        //     state.isFetching = false;
        //     setAuthHeader(null);
        // },
        // logoutFailed: (state) => {
        //     state.isFetching = false;
        // },
        // changePasswordStart: (state) => {
        //     state.isFetching =  true;
        // },
        // changePasswordSuccess: (state) => {
        // },
        
    } 
});

export const {
    addToCartStart,
    addToCartSuccess,
    updateCartStart,
    updateCartSuccess,
    deleteCartStart,
    deleteCartSuccess,
    getAllCartItemStart,
    getAllCartItemSuccess,
    resetCart,
    refreshCartStart
    // logoutFailed,
    // registerStart,
    // registerSuccess,
    // registerFailed
} = cartSlice.actions;
export default cartSlice.reducer;
