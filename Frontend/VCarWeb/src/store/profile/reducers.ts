import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfileState } from "./types";
import { IUser } from "../auth/types";

const initialState: ProfileState = {
    user: {} as IUser,
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        updateProfileRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<IUser>) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload;
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { updateProfileRequest, updateProfileSuccess, updateProfileFailure } = profileSlice.actions;
export default profileSlice.reducer;