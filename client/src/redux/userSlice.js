import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        isCheckingAuth: true,
        suggestedUsers: null,
        profileData: null,
        searchData: null
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
        },
        setProfileData: (state, action) => {
            state.profileData = action.payload;
        },
        setSearchData: (state, action) => {
            state.searchData = action.payload;
        },
    }
})

export const { setUserData, setAuthChecked, setSuggestedUsers, setProfileData, setSearchData } = userSlice.actions;
export default userSlice.reducer
