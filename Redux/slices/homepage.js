// ** Third Party Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  homepage: {},
};

const homepage = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    getHomepage: (state, action) => {
      state.homepage = action.payload;
    },
  },
});

export const { getHomepage } = homepage.actions;

export default homepage.reducer;
