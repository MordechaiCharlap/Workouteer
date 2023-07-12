import { createSlice } from "@reduxjs/toolkit";
import { createUser } from "../api/userApi"; // Assuming the createUser function is defined in a separate file

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    setUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    setUserFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
export const startListeningToUserChanges = (userId) => async (dispatch) => {
  const userDocRef = doc(db, "users", userId); // Assuming you have initialized the Firestore database instance as `db`

  const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
    const userData = snapshot.data();
    dispatch(updateUser(userData));
  });
  return unsubscribe;
};

export const { setUserStart, setUserSuccess, setUserFailure } =
  userSlice.actions;

export const createUserAsync = (newUserData) => async (dispatch) => {
  try {
    dispatch(setUserStart());
    await createUser(newUserData);
    dispatch(setUserSuccess(newUserData));
  } catch (error) {
    dispatch(setUserFailure(error.message));
  }
};

export default userSlice.reducer;
