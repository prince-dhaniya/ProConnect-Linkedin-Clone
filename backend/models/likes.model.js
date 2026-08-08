import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
});

// Enforce one-user-one-like-per-post
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
