const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const path = require('path');

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Catch-all route to serve index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // This should be after dotenv.config()
app.use(cors());

// Connect to database
connectDB();

// Use routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/project')); 

app.use('/api/time', require('./routes/time'));


// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
});
