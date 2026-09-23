const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Serve the production frontend when it has been built alongside the API.
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Root Status
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.json({
    project: 'HeatGuard AI Node.js Backend API',
    status: 'online',
    health_endpoint: '/api/health',
    predict_endpoint: '/api/predict',
    history_endpoint: '/api/history',
    disclaimer: 'This prototype provides early-warning support and does not replace professional medical care.'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` HeatGuard AI Node.js API running on port ${PORT}`);
  console.log(` Python ML URL: ${process.env.PYTHON_ML_URL || 'http://127.0.0.1:8000'}`);
  console.log(`==================================================`);
});
