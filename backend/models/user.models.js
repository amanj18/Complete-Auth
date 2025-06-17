
import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    profilePic: {
        type: String,
        default: "",
    },
    verifyOtp: {
        type: String,
        default: "",
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: "",
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    // createdAt , updatedAt => Member since <createdAt>
}, { timestamps: true, });

// collection
const User = mongoose.model("User", userSchema);

export default User;