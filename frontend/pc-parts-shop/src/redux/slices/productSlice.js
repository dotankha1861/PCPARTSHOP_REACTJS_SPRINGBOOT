import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    isFetching: false,
    products: []

  },
  reducers: {
    getAllProductStart: (state) => {
      state.isFetching = true;
    },
    getAllProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload.data;
      console.log(state.products);
    },
    createProductStart: (state) => {
      state.isFetching = true;
    },
    createProductSuccess: (state, action) => {
      state.products = [action.payload.data, ...state.products]
      state.isFetching = false;
    },
    deleteProductStart: (state) => {
      state.isFetching = true;
    },
    deleteProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    updateProductStart: (state) => {
      state.isFetching = true;
    },
    updateProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = state.products.map(product => product.id === action.payload.data.id 
        ? action.payload.data : product);
    }
  }
})

export const {
  getAllProductStart,
  getAllProductSuccess,
  createProductStart,
  createProductSuccess,
  deleteProductStart,
  deleteProductSuccess,
  updateProductStart,
  updateProductSuccess
} = productSlice.actions;
export default productSlice.reducer;