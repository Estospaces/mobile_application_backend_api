// utils/sendEmail.js
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const jwt = require("jsonwebtoken");

const fromEmail = `"Estospaces" <estospacessolutions@gmail.com>`;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
});

async function sendVerificationEmail(user) {
  try {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    const verificationLink = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}`;

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/verificationEmail.ejs"),
      {
        name: user.full_name || "there",
        verificationLink,
      }
    );

    const mailOptions = {
      from: fromEmail,
      to: user.email,
      subject: "Verify your email address",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

async function sendOtpEmail(toEmail, otp) {
  try {
    // Path to your ejs template
    const templatePath = path.join(__dirname, "../views/passwordReset.ejs");

    // Render the EJS template with the OTP value
    const html = await ejs.renderFile(templatePath, { otp });

    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: "Your OTP for Password Reset",
      html, // Pass the rendered HTML content here
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // Return success if email was sent
    return { success: true, message: "OTP email sent successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

module.exports = {
  sendVerificationEmail,
  sendOtpEmail,
};
