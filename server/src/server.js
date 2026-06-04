// load environment variables first so the rest of the app can use them
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// initialize the express application
const app = express();

// middleware to parse incoming json requests
app.use(express.json());

// middleware to allow cross origin requests from our future frontend
app.use(cors());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const noteRoutes = require('./routes/noteRoutes');
app.use('/api/notes', noteRoutes);

// grab variables from our environment file
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// connect to local mongodb instance
mongoose.connect(MONGO_URI)
  .then(() => {
    // database connected successfully
    console.log('MongoDB connection established');
    
    // start listening for requests only after database is connected
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // connection failed
    console.error('Database connection failed');
    console.error(error);
  });

// basic health check route to verify server is up
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy and running' });
});