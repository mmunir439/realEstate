const express = require("express");
const router = express.Router();
const registerCall= require("../controllers/callback.controller.js");
router.post("/register", registerCall.registerCall);
module.exports = router;
