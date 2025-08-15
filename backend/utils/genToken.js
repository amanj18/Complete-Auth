import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res, tokenVersion = 0) => {
    const token = jwt.sign(
        { userId, tokenVersion },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'none', // ✅ required for cross-site cookies
        secure: process.env.NODE_ENV === 'production', // ✅ only HTTPS in prod
    });
};

export default genTokenAndSetCookie;
