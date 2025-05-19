const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

// ✅ Register API routes BEFORE serving frontend
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/project'));
app.use('/api/time', require('./routes/time'));

// ✅ Serve frontend only after routes
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});
