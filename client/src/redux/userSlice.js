import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isCheckingAuth: true,
        suggestedUsers: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.isCheckingAuth = false;
        },
        setAuthChecked: (state) => {
            state.isCheckingAuth = false;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        }
    }
})

export const { setUserData, setAuthChecked, setSuggestedUsers } = userSlice.actions;
export default userSlice.reducer
