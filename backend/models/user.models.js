
import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 20,
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    profilePic:{
        type: String,
        default: "",
    }
    // createdAt , updatedAt => Member since <createdAt>
}, { timestamps: true, });  

// collection
const User = mongoose.model("User", userSchema);

export default User;