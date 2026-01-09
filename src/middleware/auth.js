const admin = require('../config/firebase');

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || ''
    };
    next();
  } catch (err) {
    console.error('Auth error', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
