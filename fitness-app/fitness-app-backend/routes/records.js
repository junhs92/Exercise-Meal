const express = require('express');
const pool = require('../db'); // PostgreSQL 연결
const router = express.Router();

// 운동 기록 생성 API (고객용)
router.post('/create', async (req, res) => {
  const { user_id, program_id, feedback } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Records (user_id, program_id, feedback) VALUES ($1, $2, $3) RETURNING *',
      [user_id, program_id, feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Error creating record' });
  }
});

// 특정 사용자의 운동 기록 조회 API
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM Records WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error fetching records' });
  }
});

module.exports = router;
