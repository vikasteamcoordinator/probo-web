// ** Third Party Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const products = createSlice({
  name: "products",
  initialState,
  reducers: {
    getProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { getProducts } = products.actions;

export default products.reducer;
