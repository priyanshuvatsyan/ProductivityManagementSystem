const express = require('express');
const router = express.Router();

// @route   GET /api/time/now
// @desc    Fetch current server time
// @access  Public or Private depending on your logic
router.get('/now', (req, res) => {
  res.json({ serverTime: new Date() });
});

module.exports = router;
