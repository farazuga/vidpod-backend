const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(session({
  secret: process.env.SESSION_SECRET || 'vidpod-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.get('/', (req, res) => {
  res.json({ message: 'VidPod API is running!', version: '1.0.0' });
});

app.listen(PORT, () => console.log(`🚀 VidPod Backend running on port ${PORT}`));
module.exports = app;
