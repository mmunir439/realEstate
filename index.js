const express = require('express')
const dotenv = require('dotenv');
const cors=require("cors");
const connectDB = require("./config/db.js");
const userRoutes = require('./routes/user.routes.js');
const app = express()
dotenv.config();
// Connect Database
connectDB();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('real estate assignment website introduction to management!')
})
// Use Routes
app.use('/users', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
