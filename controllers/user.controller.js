const User = require("../models/models.user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, city } = req.body;
    let photoToSave = req.file ? req.file.path || `uploads/${req.file.filename}` : req.body.photo;

   const userExists = await User.findOne({ email });
const userExistsPhone = await User.findOne({ phone });

let errors = [];

if (userExists) errors.push("Email already exists");
if (userExistsPhone) errors.push("Phone already exists");

if (errors.length > 0) {
  return res.status(400).json({ message: errors.join(" & ") });
}


    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, phone, city, photo: photoToSave });
    const savedUser = await user.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"JHRealEstate" <${process.env.EMAIL_USER}>`,
      to: savedUser.email,
      subject: "Welcome to JHRealEstate!",
      html: `<h2>Welcome, ${savedUser.name}!</h2><p>Thanks for registering!</p>`
    });

    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json({ message: "User registered successfully, welcome email sent!", user: userResponse });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: "Login successful", user: userResponse, token });
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate plain token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash to store in DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"JHRealEstate" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset.</p><p>Click <a href="${resetUrl}">here</a> to reset your password.</p><p>This link expires in 15 minutes.</p>`,
    });

    // Log plain token for Postman testing
    console.log("Reset token (for Postman testing):", resetToken);

    res.json({ message: "Password reset link sent to your email " + user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // token from URL
    const { password } = req.body;

    console.log("Received token:", token);
    console.log("Received new password:", password);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log("User found:", user);

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { forgotPassword, resetPassword, registerUser, loginUser };
