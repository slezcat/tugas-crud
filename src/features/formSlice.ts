import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  id: "",
  content: "",
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    reset: (state) => initialState,
    openForm: (state, action) => {
      state.id = action.payload?.id;
      state.content = action.payload?.data;
      state.isOpen = true;
    },
    closeForm: (state) => {
      state.id = "";
      state.content = "";
      state.isOpen = false;
    },
  },
});

export const { openForm, closeForm } = formSlice.actions;
export default formSlice.reducer;
