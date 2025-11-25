const express = require('express')
const dotenv = require('dotenv');
const connectDB = require("./config/db.js");
const userRoutes = require('./routes/user.routes.js');
const app = express()
dotenv.config();
// Connect Database
connectDB();
app.get('/', (req, res) => {
  res.send('real estate assignment website introduction to management!')
})
app.use(express.json());
// Use Routes
app.use('/users', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
