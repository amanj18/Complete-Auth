import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/genToken.js";
import { createMailOptions, sendEmail } from "../utils/mailer.js";

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            success: true,
            userData: {
                name: user.fullName,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        console.log("Error in Get User Data", error);
        res.status(500).send("Internal Server Error");
    }
};