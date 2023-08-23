import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        isFetching: false,
        error: false
    },
    reducers: {
        getAllCustomerStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getAllCustomerSuccess: (state, action) => {
            state.isFetching = false;
            state.error = false;
            state.customers = action.payload;
        },
        getAllCustomerFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        activeCustomerStart: (state) => {
            state.isFetching = true;
        },
        activeCustomerSuccess: (state, action) => {
            const {customerId, active} = action.payload;
            state.customers = state.customers.map(customer => customer.customerId === customerId ? {...customer, active} : customer);
            state.isFetching = false;
        },
        deleteCustomerStart: (state) => {
            state.isFetching = true;
        },
        deleteCustomerSuccess: (state, action) => {
            const {customerId} = action.payload;
            state.customers = state.customers.filter(customer => customer.customerId !== customerId);
            state.isFetching = false;
        }
    }
});

export const {
    getAllCustomerStart,
    getAllCustomerSuccess,
    getAllCustomerFailed,
    activeCustomerStart,
    activeCustomerSuccess,
    deleteCustomerStart,
    deleteCustomerSuccess
} = customerSlice.actions;
export default customerSlice.reducer;