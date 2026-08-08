import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", userData);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Login failed");
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", userData);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Registration failed");
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "auth/getAboutUser",
    async (userData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", { params: userData });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Failed to fetch profile");
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const getAllUser = createAsyncThunk(
    "auth/getAllUser",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/get_all_users");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Failed to fetch users");
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "auth/sendConnectionRequest",
    async (connectionInput, thunkAPI) => {
        try {
            const connectionId = typeof connectionInput === "object"
                ? (connectionInput.connectionId || connectionInput.user_id || connectionInput.user?._id || connectionInput._id)
                : connectionInput;

            const response = await clientServer.post("/user/send_connection_request", {
                token: localStorage.getItem("token"),
                connectionId
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to send request";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const getMyConnectionRequests = createAsyncThunk(
    "auth/getMyConnectionRequests",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/getConnectionRequest", {
                params: { token: localStorage.getItem("token") }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to fetch connection requests";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const getMyReceivedConnectionRequests = createAsyncThunk(
    "auth/getMyReceivedConnectionRequests",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/user_connection_request", {
                params: { token: localStorage.getItem("token") }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to fetch received requests";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const acceptConnectionRequest = createAsyncThunk(
    "auth/acceptConnectionRequest",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: data.token,
                requestId: data.connectionId,
                action_type: data.action
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to accept connection";
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)