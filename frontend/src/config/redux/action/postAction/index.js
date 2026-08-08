import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch posts");
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;
        try {
            const formData = new FormData();
            if (file) {
                formData.append("media", file);
            }
            formData.append("body", body || "");
            formData.append("token", localStorage.getItem("token"));
            const response = await clientServer.post("/post", formData);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const errorMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Failed to create post");
            return thunkAPI.rejectWithValue(errorMsg);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/delete_post", {
                token: localStorage.getItem("token"),
                postId: data.post_id
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to delete post");
        }
    }
)

export const getAllComment = createAsyncThunk(
    "post/getAllComment",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/get_comments", {
                postId: data.post_id
            });
            return thunkAPI.fulfillWithValue({ ...response.data, postId: data.post_id });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch comments");
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"),
                postId: data.post_id,
                commentBody: data.comment
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to post comment");
        }
    }
)

export const incrementPostLike = createAsyncThunk(
    "post/incrementPostLike",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/increment_post_likes", {
                postId: data.post_id,
                token: localStorage.getItem("token")
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to like post");
        }
    }
)