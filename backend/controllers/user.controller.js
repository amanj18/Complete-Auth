import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/genToken.js";
import { createMailOptions, sendEmail } from "../utils/mailer.js";

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      userData: {
        _id: user._id, // 👈 include this
        name: user.fullName,
        profilePic: user.profilePic,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    console.log("Error in Get User Data", error);
    res.status(500).send("Internal Server Error");
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Clear JWT cookie
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully", success: true });
    console.log(`🗑️ User ${user.email} deleted account`);
  } catch (error) {
    console.error("❌ Error in deleteAccount:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Edit profile
export const editProfile = async (req, res) => {
  try {
    const { fullName, gender } = req.body;
    const allowedGenders = ["male", "female", "other"];

    const updates = {};

    // Update full name if provided
    if (fullName) updates.fullName = fullName;

    // Gender & Profile Picture Logic
    if (gender && allowedGenders.includes(gender.toLowerCase())) {
      const normalizedGender = gender.toLowerCase();
      updates.gender = normalizedGender;

      if (normalizedGender === "male") {
        updates.profilePic = `https://avatar.iran.liara.run/public/boy?email=${encodeURIComponent(fullName)}`;
      } else if (normalizedGender === "female") {
        updates.profilePic = `https://avatar.iran.liara.run/public/girl?email=${encodeURIComponent(fullName)}`;
      } else {
        updates.profilePic = `https://avatar.iran.liara.run/public/${encodeURIComponent(fullName)}`;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

    console.log(`✏️ User ${updatedUser.email} updated profile`);
  } catch (error) {
    console.error("❌ Error in editProfile:", error);
    res.status(500).send("Internal Server Error");
  }
};

