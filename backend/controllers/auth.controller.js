import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/genToken.js";
import { createMailOptions, sendEmail } from "../utils/mailer.js";

export const signup = async (req, res) => {
    try {
        const { password, confirmPassword, email, fullName } = req.body;

        if (password !== confirmPassword) { // Check if passwords match
            return res.status(400).json({ message: "passwords do not match" })
        }
        const user = await User.findOne({ email }); // Check if user already exists
        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword, // Store hashed password
            // gender,
            // profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if (newUser) {

            // Send welcome email
            const mailOptions = createMailOptions({
                to: newUser.email,
                subject: "Welcome to our service",
                text: `Welcome, ${newUser.fullName}`,
                html: `<h1>Welcome ${newUser.fullName}</h1><p>Your account has been created successfully.</p>`,
            });

            await sendEmail(mailOptions); // Send email to user

            // Generate token and set cookie 
            genTokenAndSetCookie(newUser._id, res);
            await newUser.save(); // Save user to database

            // Send response with user data
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                // profilePic: newUser.profilePic,
                success: true,
            })
            console.log("User created successfully");
        }
        else {
            res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (err) {
        console.log("Error in Sign Up", err);
        res.status(500).send("Internal Server Error")
    }
}

export const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email }); // Find user by email
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || ""); // Compare password with hashed password

        // Check if user exists and password is correct
        if (!isPasswordCorrect || !user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        // Generate token and set cookie 
        genTokenAndSetCookie(user._id, res, user.tokenVersion);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            // profilePic: user.profilePic,
            success: true,
        });
        console.log("User logged in successfully");
    }
    catch (err) {
        console.log("Error in Login ", err);
        res.status(500).send("Internal Server Error")
    }
}

export const logout = async (req, res) => {
    try {
        // res.clearCookie("jwt"); // Clear the cookie from the client side
        // Optionally, you can also set the cookie to expire immediately on the server side
        res.cookie("jwt", "", {
            maxAge: 0,
        });

        res.status(200).json({ message: "Logout successful" , success: true });
        console.log("User logged out successfully");

    } catch (error) {
        console.log("Error in Logout ", error);
        res.status(500).send("Internal Server Error")

    }
}   

export const logoutAll = async (req, res) => {
  try {
    const user = req.user;
    user.tokenVersion += 1; // Invalidate all previous tokens
    await user.save();

    res.cookie("jwt", "", { maxAge: 0 }); // Clear the cookie from the client side
    res.status(200).json({ message: "Logged out from all devices" });
    console.log("User logged out from all sessions");
    
  } catch (error) {
    console.log("Error in Logout All", error);
    res.status(500).send("Internal Server Error");
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const email = req.user?.email; // from token

    if (!email) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    const mailOptions = createMailOptions({
      to: user.email,
      subject: "Verify Your Account",
      text: `Your verification OTP is: ${otp}`,
      html: `<h3>Your OTP is</h3><p><b>${otp}</b></p><p>This OTP will expire in 10 minutes.</p>`,
    });

    const isEmailSent = await sendEmail(mailOptions);

    if (!isEmailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully", success: true });
    console.log("Verification OTP sent successfully");

  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.user?.email;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.verifyOtpExpireAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    res.status(200).json({ message: "Account verified successfully", success: true });
    console.log("User account verified");
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const isAuthenticated = (req, res) => {
  try {
    const user = req.user; // User is set by the verifyToken middleware
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      // profilePic: user.profilePic,
      isAccountVerified: user.isAccountVerified,
      success: true,
    });
    console.log("User is authenticated");

  } catch (error) {
    console.error("Error in isAuthenticated:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    await user.save();

    const mailOptions = createMailOptions({
      to: user.email,
      subject: "Reset Your Password",
      text: `Your password reset OTP is: ${otp}`,
      html: `<h3>Your OTP is</h3><p><b>${otp}</b></p><p>This OTP will expire in 10 minutes.</p>`,
    });

    const isEmailSent = await sendEmail(mailOptions);

    if (!isEmailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP sent successfully" , success: true });
    console.log("✅ Password reset OTP sent successfully");

  } catch (error) {
    console.error("❌ Error in sendPasswordResetOtp:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.resetOtpExpireAt) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    // Clear OTP fields
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" , success: true });
    console.log("✅ User password reset successfully");

  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).send("Internal Server Error");
  }
};
