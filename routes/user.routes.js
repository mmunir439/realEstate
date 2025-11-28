const userController = require("../controllers/user.controller.js");
const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // You can configure storage as needed

// Route to register user with file upload
router.post("/register", upload.single("photo"), userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.put("/reset-password/:token", userController.resetPassword);
module.exports = router;
