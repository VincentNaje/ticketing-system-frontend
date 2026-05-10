const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('./server/routes/tickets');
const authRoutes = require('./server/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───
app.use(cors());
app.use(express.json());

// ─── API Routes ───
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

// ─── Static frontend (Vite production build → ./dist) ───
const distDir = path.join(__dirname, 'dist');
const distIndex = path.join(distDir, 'index.html');

if (fs.existsSync(distIndex)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(distIndex);
  });
} else {
  app.get('/', (req, res) => {
    res.status(503).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Frontend not built</title></head>
<body style="font-family:system-ui,sans-serif;padding:2rem;line-height:1.5">
  <h1>Frontend not built</h1>
  <p>From the project root:</p>
  <pre style="background:#f5f5f5;padding:1rem;overflow:auto">npm install
npm run build</pre>
  <p>For development:</p>
  <pre style="background:#f5f5f5;padding:1rem;overflow:auto">npm start
npm run client:dev</pre>
</body></html>`);
  });
}

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
