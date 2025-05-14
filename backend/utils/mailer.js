import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

//
export const createMailOptions = ({ to, subject, text, html }) => ({ // Create mail options
  from: process.env.SENDER_EMAIL,
  to,
  subject,
  text,
  html,
});

// Send email function
export const sendEmail = async (mailOptions) => {
  try {
    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:");
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};
