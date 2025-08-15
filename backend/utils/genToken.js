import jwt from 'jsonwebtoken';

const genTokenAndSetCookie = (userId, res, tokenVersion = 0) => {
  const token = jwt.sign({ userId, tokenVersion }, process.env.JWT_SECRET, {    
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  });
};

export default genTokenAndSetCookie;
