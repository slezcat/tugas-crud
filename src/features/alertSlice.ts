import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAlertOpen: false,
  option: "",
  alertMessage: "",
  duration: 3000,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert: (state, action) => {
      state.isAlertOpen = true;
      state.option = action.payload.option;
      state.alertMessage = action.payload.alertMessage;
    },
    closeAlert: (state) => {
      state.alertMessage = "";
      state.isAlertOpen = false;
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;
export default alertSlice.reducer;
