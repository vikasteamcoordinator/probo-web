// ** Third Party Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coupons: [],
};

const coupons = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    getCoupons: (state, action) => {
      state.coupons = action.payload;
    },
  },
});

export const { getCoupons } = coupons.actions;

export default coupons.reducer;
