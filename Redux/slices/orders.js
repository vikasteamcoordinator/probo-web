// ** Third Party Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orders = createSlice({
  name: "orders",
  initialState,
  reducers: {
    getOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { getOrders } = orders.actions;

export default orders.reducer;
