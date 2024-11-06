// ** Third Party Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  siteSettings: [],
};

const siteSettings = createSlice({
  name: "siteSettings",
  initialState,
  reducers: {
    getSiteSettings: (state, action) => {
      state.siteSettings = action.payload;
    },
  },
});

export const { getSiteSettings } = siteSettings.actions;

export default siteSettings.reducer;
