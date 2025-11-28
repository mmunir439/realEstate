const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Callback", callbackSchema);
