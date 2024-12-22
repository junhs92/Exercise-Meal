const express = require('express');
const pool = require('../db'); // PostgreSQL 연결
const router = express.Router();

// 운동 프로그램 생성 API (전문가만 가능)
router.post('/create', async (req, res) => {
  const { name, description, created_by } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO Programs (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ error: 'Error creating program' });
  }
});

// 운동 프로그램 목록 조회 API
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Programs');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Error fetching programs' });
  }
});

module.exports = router;
