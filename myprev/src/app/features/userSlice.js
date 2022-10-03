import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null
    },

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setAvatar: (state, action) => {
            state.user.avatar = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setUser, setAvatar, setToken } = userSlice.actions
export default  userSlice.reducer