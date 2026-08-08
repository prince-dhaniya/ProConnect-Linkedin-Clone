import { Router } from "express";
import { activeCheck, createPost, delete_comment_of_user, deletePost, get_comments_by_post, getAllPosts, increment_likes } from "../controllers/posts.controller.js";
import multer from "multer";
import { commentPost } from "../controllers/user.controller.js";

const router = Router();



const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename: (req,file,cb)=>{
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, uniqueSuffix + "-" + cleanName);
    },
})

const upload = multer({storage: storage})

router.route('/').get(activeCheck);
router.route("/post").post(upload.single('media'),createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").post(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_likes").post(increment_likes);




export default router;