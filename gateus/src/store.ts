import { configureStore } from "@reduxjs/toolkit";
import tabHistorySlice from "./components/canvas/flowsSlice";

export const store = configureStore({
  reducer: {
    tabHistorySlice: tabHistorySlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
