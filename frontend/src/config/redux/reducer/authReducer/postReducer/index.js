import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, createPost, deletePost, getAllComment, postComment, incrementPostLike } from "../../../action/postAction";

const initialState = {
    posts: [],
    comments: [],
    postId: "",
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

const postSlice = createSlice({
    name: "postReducer",
    initialState,
    reducers: {
        resetPostId: (state) => {
            state.postId = "";
            state.comments = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.posts = action.payload.posts;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.message = "Post created successfully";
            })

            .addCase(deletePost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = "Post deleted successfully";
            })

            .addCase(getAllComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload.comments;
                state.postId = action.payload.postId;
            })

            .addCase(postComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = "Comment added successfully";
            })

            .addCase(incrementPostLike.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = "Post liked";
            })
    }
})

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;
