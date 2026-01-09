const express = require('express');
const Url = require('../models/Url');
const auth = require('../middleware/auth');
const generateShortCode = require('../utils/shortCode');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ message: 'originalUrl is required' });
    }

 
    try {
      new URL(originalUrl);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    const userId = req.user.uid;

    const count = await Url.countDocuments({ userId });
    if (count >= 100) {
      return res.status(403).json({
        message:
          'Free tier limit reached (100 URLs). Please upgrade your plan.'
      });
    }

    let shortCode = generateShortCode(
      6 + Math.floor(Math.random() * 3) // 6–8 chars
    );

    let exists = await Url.findOne({ shortCode });
    while (exists) {
      shortCode = generateShortCode(
        6 + Math.floor(Math.random() * 3)
      );
      exists = await Url.findOne({ shortCode });
    }

    const url = await Url.create({
      shortCode,
      originalUrl,
      userId
    });

    const shortUrl = `${process.env.BASE_SHORT_URL}/${shortCode}`;

    res.status(201).json({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl,
      clicks: url.clicks,
      createdAt: url.createdAt
    });
  } catch (err) {
    console.error('Create URL error', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    const data = urls.map((url) => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_SHORT_URL}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt
    }));

    res.json(data);
  } catch (err) {
    console.error('Get URLs error', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { id } = req.params;

    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    await Url.deleteOne({ _id: id });
    res.status(204).send();
  } catch (err) {
    console.error('Delete URL error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

