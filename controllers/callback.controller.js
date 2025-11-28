const Callback = require("../models/models.callback.js");
const transporter = require("../config/mailer.js");
const dotenv = require("dotenv");
dotenv.config();
exports.registerCall = async (req, res) => {
  try {
    const { email, phone, username } = req.body;

    // Basic Checks
    if (!email || !phone || !username) {
      return res
        .status(400)
        .json({ message: "Email, phone, and username are required." });
    }

    // Save to database
    const newCall = new Callback({ email, phone, username });
    await newCall.save();

    // EMAIL CONTENT
    const mailOptions = {
      from: `"Javid Hills Exclusive" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You! We Received Your Callback Request",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color: #4CAF50;">Hi ${username},</h2>
          <p>Thank you for requesting a call back.</p>
          <p>Our team will contact you shortly on this number: <strong>${phone}</strong>.</p>

          <p style="margin-top: 20px;">Take care!<br><strong>Javid Hills Exclusive Team</strong></p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Callback request registered successfully & email sent!",
      data: newCall,
    });

  } catch (error) {
    console.error("Error registering call:", error);
    return res.status(500).json({
      message: "Server error while saving callback.",
      error: error.message,
    });
  }
};
