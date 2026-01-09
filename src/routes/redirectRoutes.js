const express = require('express');
const Url = require('../models/Url');

const router = express.Router();

// public redirect route
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).send('Short URL not found');
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Redirect error', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
