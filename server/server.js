const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

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
app.use('/api', require('./routes/time'));

// Start server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server running');
});
