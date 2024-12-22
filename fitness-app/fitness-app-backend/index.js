const express = require('express');
const cors = require('cors');
const authRoutes = require('./middleware/auth');
const userRoutes = require('./routes/users');
const exerciseGroupRoutes = require('./routes/exerciseGroup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Enable CORS for React frontend
app.use(express.json()); // JSON 요청 파싱

// 라우트 연결
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exerciseGroups', exerciseGroupRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Exercise Tracker API');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
