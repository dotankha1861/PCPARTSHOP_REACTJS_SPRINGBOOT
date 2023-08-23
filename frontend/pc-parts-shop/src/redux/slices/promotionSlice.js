import { createSlice } from "@reduxjs/toolkit";

const promotionSlice = createSlice({
  name: "promotions",
  initialState: {
    isFetching: false,
    promotions: []

  },
  reducers: {
    getAllPromotionStart: (state) => {
      state.isFetching = true;
    },
    getAllPromotionSuccess: (state, action) => {
      state.isFetching = false;
      state.promotions = action.payload.data;
      console.log(state.promotions);
    },
    createPromotionStart: (state) => {
      state.isFetching = true;
    },
    createPromotionSuccess: (state, action) => {
      state.promotions = [action.payload.data, ...state.promotions]
      state.isFetching = false;
    },
    deletePromotionStart: (state) => {
      state.isFetching = true;
    },
    deletePromotionSuccess: (state, action) => {
      state.isFetching = false;
      state.promotions = state.promotions.filter(promotion => promotion.id !== action.payload);
    },
    updatePromotionStart: (state) => {
      state.isFetching = true;
    },
    updatePromotionSuccess: (state, action) => {
      state.isFetching = false;
      state.promotions = state.promotions.map(promotion => promotion.id === action.payload.data.id 
        ? action.payload.data : promotion);
    },
    cancelPromotionStart: (state) => {
      state.isFetching = true;
    },
    cancelPromotionSuccess: (state, action) => {
      const {id, expirationDate} = action.payload;
      state.promotions = state.promotions.map(item => item.id === id ? {...item, expirationDate} : item);
      state.isFetching = false;
    }
  }
})

export const {
  getAllPromotionStart,
  getAllPromotionSuccess,
  createPromotionStart,
  createPromotionSuccess,
  deletePromotionStart,
  deletePromotionSuccess,
  updatePromotionStart,
  updatePromotionSuccess,
  cancelPromotionStart,
  cancelPromotionSuccess
} = promotionSlice.actions;
export default promotionSlice.reducer;