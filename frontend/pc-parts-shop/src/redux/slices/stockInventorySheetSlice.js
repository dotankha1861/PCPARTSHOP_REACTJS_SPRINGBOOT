import { createSlice } from "@reduxjs/toolkit";
import { data } from "autoprefixer";

const siSheetSlice = createSlice({
  name: "siSheets",
  initialState: {
    isFetching: false,
    siSheets: []
  },
  reducers: {
    getAllSISheetStart: (state) => {
      state.isFetching = true;
    },
    getAllSISheetSuccess: (state, action) => {
      state.isFetching = false;
      state.siSheets= action.payload.data;
      console.log(state.siSheets);
    },
    createSISheetStart: (state) => {
      state.isFetching = true;
    },
    createSISheetSuccess: (state, action) => {
      state.isFetching = false;
      state.siSheets = [action.payload.data, ...state.siSheets];
    }
    // approveOrderStart: (state) => {
    //   state.isFetching = true;
    // },
    // approveOrderSuccess: (state, action) => {
    //     state.isFetching = false;
    //     const {employeeId, orderId, employeeName} = action.payload;
    //     state.orders = state.orders.map(order => order.id === orderId ? {...order, employeeId, employeeName, status: "XACNHAN"} : order);
    // },
    // getAllOrderCustomerStart: (state) => {
    //   state.isFetching = true;
    // },
    // getAllOrderCustomerSuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.orders = action.payload.data;
    // },
    // cancelOrderStart: (state) => {
    //   state.isFetching = true;
    // },
    // cancelOrderSuccess: (state, action) => {
    //   const {id, employeeId, employeeName} = action.payload;
    //   if(employeeId){
    //     state.orders = state.orders.map(order => order.id === id ? {...order, employeeId, employeeName, status: "DAHUY"}: order);
    //   }
    //   else{
    //     state.orders = state.orders.map(order => order.id === id ? {...order, status: "DAHUY"}: order);
    //   }
    //   state.isFetching = false;
    // },
    // updateStatusOrderStart: (state) => {
    //   state.isFetching = true;
    // },
    // updateStatusOrderSuccess: (state, action) => {
    //   const {orderId, status} = action.payload;
    //   state.orders = state.orders.map(order => order.id === orderId ? {...order, status: status}: order);
    //   state.isFetching = false;
    // }

    // createOrderStart: (state) => {
    //   state.isFetching = true;
    // },
    // createCategorySuccess: (state, action) => {
    //   state.categories = [action.payload.data, ...state.categories]
    //   state.isFetching = false;
    // },
    // deleteCategoryStart: (state) => {
    //   state.isFetching = true;
    // },
    // deleteCategorySuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.categories = state.categories.filter(category => category.id !== action.payload);
    // },
    // updateCategoryStart: (state) => {
    //   state.isFetching = true;
    // },
    // updateCategorySuccess: (state, action) => {
    //   state.isFetching = false;
    //   state.categories = state.categories.map(category => category.id === action.payload.data.id 
    //     ? action.payload.data : category);
    // }
  }
})

export const {
    getAllSISheetStart,
    getAllSISheetSuccess,
    createSISheetStart,
    createSISheetSuccess
//   approveOrderStart,
//   approveOrderSuccess,
//   getAllOrderCustomerStart,
//   getAllOrderCustomerSuccess,
//   cancelOrderStart,
//   cancelOrderSuccess,
//   updateStatusOrderStart,
//   updateStatusOrderSuccess
//   createCategoryStart,
//   createCategorySuccess,
//   deleteCategoryStart,
//   deleteCategorySuccess,
//   updateCategoryStart,
//   updateCategorySuccess
} = siSheetSlice.actions;
export default siSheetSlice.reducer;