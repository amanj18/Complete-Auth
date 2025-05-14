import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/genToken.js";
import { createMailOptions, sendEmail } from "../utils/mailer.js";

export const signup = async (req, res) => {
    try {
        const { password, confirmPassword, email, fullName, gender } = req.body;

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

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?email=${email}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?email=${email}`;

        // Create new user
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword, // Store hashed password
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
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
                profilePic: newUser.profilePic
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
        genTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
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

        res.status(200).json({ message: "Logout successful" });
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