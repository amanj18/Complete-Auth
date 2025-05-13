import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {    
        expiresIn: '15d',
    });
    res.cookie('jwt', token, {
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie (XSS attack)
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSite: 'strict', // CSRF attacks protection
        // secure: process.env.NODE_ENV !== 'development',
    });
}

export default genTokenAndSetCookie;