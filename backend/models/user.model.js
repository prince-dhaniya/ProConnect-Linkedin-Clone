import mongoose,{Schema} from "mongoose";

const UserSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    active:{
        type: Boolean,
        default: true
    },
    password:{
        type: String,
        required: true
    },
    profilePicture:{
        type: String,
        default:'default.jpg'
    },
    coverPicture:{
        type: String,
        default:'default_cover.jpg'
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    token:{
        type: String,
        default:''
    }
})

export const User = mongoose.model("User",UserSchema);