import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import groceryReducer from "../features/grocerySlice";
import formReducer from "../features/formSlice";
import alertReducer from "../features/alertSlice";

export const store = configureStore({
  reducer: { grocery: groceryReducer, form: formReducer,alert:alertReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
