import Profile from "../models/profile.model.js"
import { User } from "../models/user.model.js";
import { Post } from "../models/posts.model.js";
import { ConnectionRequest } from "../models/connections.model.js";
import Comment from "../models/comments.model.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';
import fs from 'fs';


const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.pseudoRandomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/"+ outputPath);


    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`,{width:100,align:"center"})
    doc.fontSize(14).text(`Name: ${userData.userId.name}`);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio: ${userData.bio}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(14).text("Past Work: ")
    userData.pastWork.forEach((work,index)=> {
        doc.fontSize(14).text(`Company Name: ${work.company}`);
        doc.fontSize(14).text(`Position: ${work.position}`); 
        doc.fontSize(14).text(`Years: ${work.years}`); 
    });

    doc.end();

    return outputPath;
}

export const register = async (req, res) => {

    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) return res.status(400).json({ message: "all fields are required" });

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "user already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res.json({ message: "user created successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All Fields are required" });
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "user does not exist" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "invalid creds" })

        const token = crypto.randomBytes(20).toString("hex");
        await User.updateOne({ _id: user._id }, { token });

        return res.json({ token });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        user.profilePicture = req.file.filename;
        await user.save();
        return res.json({ message: "profile picture updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const uploadCoverPicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        user.coverPicture = req.file.filename;
        await user.save();
        return res.json({ message: "cover picture updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "user not found" });

        const { username, email } = newUserData;

        if (username || email) {
            const query = [];
            if (username) query.push({ username });
            if (email) query.push({ email });

            if (query.length > 0) {
                const existingUser = await User.findOne({ $or: query });
                if (existingUser && String(existingUser._id) !== String(user._id)) {
                    return res.status(400).json({ message: "user already exists" });
                }
            }
        }

        Object.assign(user, newUserData);

        await user.save();

        return res.json({ message: "user updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getUserAndProfile = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "user not found" });

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture coverPicture');

        const profileData = userProfile ? userProfile.toObject() : {};

        const connectionsCount = await ConnectionRequest.countDocuments({
            $or: [{ userId: user._id }, { connectionId: user._id }],
            status_accepted: true
        });

        return res.json({ profile: { ...profileData, connectionsCount } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });
        if (!userProfile) return res.status(404).json({ message: "user not found" });

        const profile_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(profile_to_update, newProfileData);
        await profile_to_update.save();
        return res.json({ message: "profile updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const getAllUserProfile = async (req, res) => {

    try {
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({ profiles });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


export const downloadProfile = async (req, res) => {
    try {
        const user_id = req.query.id;

        const userProfile = await Profile.findOne({ userId: user_id })
            .populate('userId', 'name email username profilePicture');

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let outputPath = await convertUserDataTOPDF(userProfile);

        return res.json({ message: outputPath });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const sendConnectionRequest =async(req,res)=>{

    const {token,connectionId} = req.body;
    try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connectionUser = await User.findOne({_id:connectionId});
        if(!connectionUser) return res.status(404).json({message:"connection user not found"});
        
        if (user._id.toString() === connectionUser._id.toString()) {
            return res.status(400).json({ message: "cannot send connection request to yourself" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { userId: user._id, connectionId: connectionUser._id },
                { userId: connectionUser._id, connectionId: user._id }
            ]
        });

        if (existingRequest) return res.status(400).json({ message: "connection request already sent or received" });
      
        const request = new ConnectionRequest({
            userId : user._id,
            connectionId: connectionUser._id
        })
        await request.save();
        return res.json({message:"connection request sent successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

export const getMyConnectionRequest = async(req,res)=>{

    const {token}=req.query;
    try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connections = await ConnectionRequest.find({userId:user._id})
        .populate('connectionId','name username email profilePicture');

        return res.json({connections});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const whatAreMyConnection = async(req,res)=>{
    const {token}=req.query;
    try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connections = await ConnectionRequest.find({connectionId:user._id})
        .populate('userId','name username email profilePicture');

        return res.json(connections);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}   


export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;
    try {
        const user = await User.findOne({token});
        if(!user) return res.status(404).json({message:"user not found"});

        const connection = await ConnectionRequest.findOne({_id:requestId});
        if(!connection) return res.status(404).json({message:"connection not found"});

        if(action_type === "accept") {
            connection.status_accepted = true;
            await connection.save();
        } else {
            await ConnectionRequest.deleteOne({ _id: requestId });
        }
        return res.json({ message: "connection request updated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}   


export const commentPost = async (req,  res)=>{

    const {token,postId,commentBody} = req.body;
    try {
        const user = await User.findOne({token: token}).select("_id");
        if(!user) return res.status(404).json({message:"user not found"});

        const post = await Post.findOne({_id:postId});
        if(!post) return res.status(404).json({message:"post not found"});

        const comment = new Comment({
            userId:user._id,
            postId:post._id,
            body:commentBody
        });
        await comment.save();
        return res.json({message:"comment added successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}


export const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.query;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "user not found" });

        const profile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture coverPicture');

        const profileData = profile ? profile.toObject() : {};

        const connectionsCount = await ConnectionRequest.countDocuments({
            $or: [{ userId: user._id }, { connectionId: user._id }],
            status_accepted: true
        });

        return res.json({ profile: { ...profileData, connectionsCount } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}