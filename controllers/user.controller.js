const User = require("../models/models.user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // If you wish to use JWT

// Controller function to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, city } = req.body;
    // If multer handled a file upload it will be in `req.file`.
    // Otherwise a client may send a photo URL in `req.body.photo`.
    let photoToSave;
    if (req.file) {
      photoToSave = req.file.path || (`uploads/${req.file.filename}`);
    } else if (req.body && req.body.photo) {
      photoToSave = req.body.photo;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email: " + email });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (only set photo if we have one so Mongoose default applies)
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      city,
    };
    if (photoToSave) userData.photo = photoToSave;

    const user = new User(userData);

    // Save user to DB
    const savedUser = await user.save();

    // Return success response without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Controller function to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Always generate JWT
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ message: "Login successful", user: userResponse, token }); // Always provide the token
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser };