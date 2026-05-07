const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('./src/routes/tickets');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───
app.use(cors());
app.use(express.json());

// ─── API Routes ───
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

// ─── Static frontend (homepage-guest, homepage-staff, guest-dashboard, …)
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  res.redirect(302, '/homepage-guest/');
});

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});