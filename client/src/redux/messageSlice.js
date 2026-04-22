import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "post",
    initialState: {
        selectedUser: JSON.parse(localStorage.getItem('selectedUser')) || null,
        messages: [],
        prevChatUsers: null,
    },
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
            localStorage.setItem('selectedUser', JSON.stringify(state.selectedUser));
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setPrevChatsUsers: (state, action) => {
            state.prevChatUsers = action.payload;
        },
    }
})

export const { setSelectedUser, setMessages, setPrevChatsUsers } = messageSlice.actions;
export default messageSlice.reducer
