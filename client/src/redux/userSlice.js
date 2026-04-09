import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isCheckingAuth: true
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isCheckingAuth = false;
        }
    }
})

export const { setUserData } = userSlice.actions;
export default userSlice.reducer
