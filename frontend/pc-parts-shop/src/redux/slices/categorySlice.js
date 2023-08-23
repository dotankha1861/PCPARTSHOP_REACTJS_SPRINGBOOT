import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    isFetching: false,
    categories: []
  },
  reducers: {
    getAllCategoryStart: (state) => {
      state.isFetching = true;
    },
    getAllCategorySuccess: (state, action) => {
      state.isFetching = false;
      state.categories = action.payload.data;
      console.log(state.categories);
    },
    createCategoryStart: (state) => {
      state.isFetching = true;
    },
    createCategorySuccess: (state, action) => {
      state.categories = [action.payload.data, ...state.categories]
      state.isFetching = false;
    },
    deleteCategoryStart: (state) => {
      state.isFetching = true;
    },
    deleteCategorySuccess: (state, action) => {
      state.isFetching = false;
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
    updateCategoryStart: (state) => {
      state.isFetching = true;
    },
    updateCategorySuccess: (state, action) => {
      state.isFetching = false;
      state.categories = state.categories.map(category => category.id === action.payload.data.id 
        ? action.payload.data : category);
    }
  }
})

export const {
  getAllCategoryStart,
  getAllCategorySuccess,
  createCategoryStart,
  createCategorySuccess,
  deleteCategoryStart,
  deleteCategorySuccess,
  updateCategoryStart,
  updateCategorySuccess
} = categorySlice.actions;
export default categorySlice.reducer;