import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,
  location: null,
  minutes: null,
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setMinutes: (state, action) => {
      state.minutes = action.payload;
    },
  },
});
export default workoutSlice;

export const { setType, setLocation, setMinutes } = workoutSlice.actions;

//Selectors
export const selectType = (state) => state.workout.type;
export const selectLocation = (state) => state.workout.location;
export const selectMinutes = (state) => state.workout.minutes;
