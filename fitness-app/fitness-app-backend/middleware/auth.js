const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { restart } = require('nodemon');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'a4f8093ab731f9a715f0a5e6cf3bc89a6dfcd4cdb5a14c7f674cbd4aa524af24';

// 회원가입 라우트
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  
  try {
    const userCheck = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if(userCheck.rows.length > 0){
      return res.status(400).json({error: 'User already exists'});
    }

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 삽입
    const newUser = await pool.query(
      'INSERT INTO Users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role]
    );

     console.log('User registered:', newUser.rows[0]); // 성공 시 사용자 정보 로그 출력
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error); // 상세한 오류 로그 출력
    res.status(500).json({ error: 'Error registering user' });
  }
});

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 이메일로 사용자 조회
    const result = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials: No user' }); // 사용자 없음
      }
  
      // 비밀번호 비교
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials: Wrong Pass' }); // 비밀번호 틀림
      }
  
      // JWT 토큰 발행
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );
  
      res.json({ token }); // 토큰 반환
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
});

router.get('/users/:userid', async (req, res) => {
  const authHeader = req.headers.authorization;
  const {userId} = req.params;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const result = await pool.query('SELECT * FROM Users WHERE id = $1', [userId]);
    const feedbackResult = await pool.query('SELECT feedback FROM Feedback WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      activity: result.rows
    }); // Return user data
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});


// 운동 모음 DB에서 가지러 가기
router.get('/users/:userid/exercise-groups', async(req, res) => {
  const {userId} = req.params;

  try{
    const groupResult = await pool.query(
      'SELECT id, group_name, group_date FROM ExerciseGroups WHERE user_id = $1 ORDER BY group_date DESC',
      [userId]
    );
    res.json({exerciseGroups: groupResult.rows});
  } catch (error) {
    console.error('Error fetching exercise groups: ', error);
    res.status(500).json({error: 'Failed to fetch exercise groups'});
  }
});


module.exports = router;
