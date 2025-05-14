import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res, tokenVersion = 0) => {
    // Generate JWT token
    const token = jwt.sign({ userId , tokenVersion }, process.env.JWT_SECRET, {    
        expiresIn: '7d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie (XSS attack)
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 15 days
        sameSite: 'strict', // CSRF attacks protection
        // secure: process.env.NODE_ENV === "production", 
    });
}

export default genTokenAndSetCookie;