require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());

// API routes
app.use('/api/urls', urlRoutes);

// public redirect route
app.use('/r', redirectRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
