import { User } from "../models/user.model.js";
import { Post } from "../models/posts.model.js";
import Comment from "../models/comments.model.js";
import { Like } from "../models/likes.model.js";

export const activeCheck= async(req,res)=>{
    return res.status(200).json({message:"active"})
}


export const createPost = async (req,res)=>{
    const {token} = req.body;

    try {

        const user = await User.findOne({token});
        if(!user) return res.status(400).json({message:"user not found"});

        const bodyContent = req.body.body || "";
        const mediaFile = req.file != undefined ? req.file.filename : "";
        const fileType = req.file != undefined ? req.file.mimetype.split("/")[0] : "";

        if (!bodyContent.trim() && !mediaFile) {
            return res.status(400).json({message: "Post cannot be empty"});
        }

        const post = new Post({
            userId: user._id,
            body: bodyContent,
            media: mediaFile,
            fileType: fileType,
        });

        await post.save();
        return res.status(200).json({message:"post created successfully"});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const getAllPosts = async (req,res)=>{

    try {
        const posts = await Post.find()
        .populate('userId','name email username profilePicture')
        return res.json({posts});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const deletePost = async (req, res)=>{
    const { token ,postId} = req.body;

    try {
        const user = await User.findOne({token}).select("_id");
        if(!user) return res.status(400).json({message:"user not found"});

        const post = await Post.findOne({_id:postId});
        if(!post) return res.status(400).json({message:"post not found"});

        if(post.userId.toString() != user._id.toString()) return res.status(400).json({message:"you are not authorized to delete this post"});

        await Post.deleteOne({_id:postId});
        return res.status(200).json({message:"post deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
};


export const get_comments_by_post = async (req,res)=>{
    const {postId} = req.body;
    try {
        const comments = await Comment.find({postId: postId})
            .populate('userId', 'name username profilePicture');
        
        return res.json({comments});

    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const delete_comment_of_user =  async(req,res)=>{
    const { token ,comment_id} = req.body;
    try {
      const user = await User.findOne({token}).select("_id");
      if(!user) return res.status(400).json({message:"user not found"});

      const comment = await Comment.findOne({"_id":comment_id});
      if(!comment) return res.status(404).json({message:"comment not found"});

      if(comment.userId.toString() != user._id.toString()) return res.status(400).json({message:"you are not authorized to delete this comment"});

      await Comment.deleteOne({"_id":comment_id});
      return res.status(200).json({message:"comment deleted successfully"});


    } catch (error) {
       return res.status(500).json({message:error.message}); 
    }
}


export const increment_likes = async (req,res)=>{
    const {postId, token} = req.body;
    try {
        const user = await User.findOne({token: token}).select("_id");
        if(!user) return res.status(404).json({message:"user not found"});

        const post = await Post.findOne({_id: postId});
        if(!post) return res.status(400).json({message:"post not found"});

        const existingLike = await Like.findOne({ userId: user._id, postId: post._id });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            post.likes = Math.max(0, post.likes - 1);
            await post.save();
            return res.status(200).json({message:"post unliked successfully"});
        } else {
            const newLike = new Like({ userId: user._id, postId: post._id });
            await newLike.save();
            post.likes += 1;
            await post.save();
            return res.status(200).json({message:"post liked successfully"});
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({message:"post already liked"});
        }
        return res.status(500).json({message:error.message});
    }
}
