import { Router } from "express";
import { register, login, getUserAndProfile, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionRequest, whatAreMyConnection, updateProfileData, acceptConnectionRequest, updateUserProfile, uploadProfilePicture, uploadCoverPicture, getProfileByUsername } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, uniqueSuffix + "-" + cleanName);
    }
});

const upload = multer({ storage: storage });

router.route('/update_profile_picture')
.post(upload.single('profilePicture'),uploadProfilePicture);

router.route('/update_cover_picture')
.post(upload.single('coverPicture'),uploadCoverPicture);

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserProfile);
router.route('/get_user_and_profile').get(getUserAndProfile);
router.route('/update_profile_data').post(updateProfileData);
router.route('/user/get_all_users').get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatAreMyConnection);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getProfileByUsername);



export default router;