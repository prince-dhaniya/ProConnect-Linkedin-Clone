import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser, getAllUser, getMyConnectionRequests, getMyReceivedConnectionRequests } from "../../action/authAction";





const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connection: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.message = "Knocking the door"
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.isTokenThere = true;
                state.message = "Login is successfully";
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.message = "Registering you..."
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false;
                state.message = "Registered successfully, Please Login"
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.profileFetched = true;
                state.user = action.payload.profile
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.all_users = action.payload.profiles;
                state.all_profiles_fetched = true;
            })
            .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.connection = action.payload.connections;
            })
            .addCase(getMyReceivedConnectionRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.connectionRequest = action.payload;
            })
    }
})

export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;

export default authSlice.reducer