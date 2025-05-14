import jwt from "jsonwebtoken";
import User from "../models/user.models.js";


const verifyToken = async(req, res, next) => {

    try {
        const token = req.cookies.jwt; // Extract token from cookies
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        if(!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Fetch user details without password
        if (!user || decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        req.user = user; // Attach the user info to the request object
        next(); // Proceed to the next middleware or route handler
    }
    catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default verifyToken;
// This middleware checks if the JWT token is valid and attaches the user info to the request object.