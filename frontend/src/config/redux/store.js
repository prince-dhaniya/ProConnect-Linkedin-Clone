import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/authReducer/postReducer";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer,
    }
})