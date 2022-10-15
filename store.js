import { configureStore } from "@reduxjs/toolkit";
import workoutSlice from "./slices/workoutSlice";

const store = configureStore({
  reducer: workoutSlice.reducer,
});
export default store;
