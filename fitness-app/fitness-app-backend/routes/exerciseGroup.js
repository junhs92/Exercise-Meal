const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Route to get all exercise groups for a specific user of the most recent group_date
router.get('/:userId/range', async(req, res) => {
  const {userId} = req.params;
  const {start_date, end_date, limit = 10} = req.query;

  try{
    const query = `
    SELECT * FROM ExerciseGroups
    WHERE user_id = $1
    ${start_date ? "AND group_date >= $2" : ""}
    ${end_date ? "AND group_date <= $3" : ""}
    ORDER BY group_date DESC
    LIMIT $4
    `;
    const values = [userId, start_date, end_date, limit].filter(Boolean);

    const groups = await pool.query(query, values);
    res.json({exerciseGroups: groups.rows});
  } catch (error) {
    console.error('Error fetching exercise groups: ', error);
    res.status(500).json({error: 'Failed to fetch exercise groups'});
  }
});


router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM ExerciseGroups WHERE user_id = $1 ORDER BY group_date DESC LIMIT 1',
      [userId]
    );
    res.json({ exerciseGroups: result.rows });
  } catch (error) {
    console.error('Error fetching exercise groups:', error);
    res.status(500).json({ error: 'Failed to fetch exercise groups' });
  }
});

// Route to get all exercises for a specific exercise group'http://localhost:5000/api/exercises/' + group.id
router.get('/:groupId/exercises', async (req, res) => {
  const { groupId } = req.params;
  console.log("group_id: ", groupId);

  try {
    const exercisesResult = await pool.query(
      'SELECT exercise_name, weight, reps, sets FROM Exercises WHERE group_id = $1',
      [groupId]
    );
    res.json({ exercises: exercisesResult.rows });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// Route to add a new exercise group for a user
router.post('/', async (req, res) => {
  const { user_id, group_name, group_date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO ExerciseGroups (user_id, group_name, group_date) VALUES ($1, $2, $3) RETURNING *',
      [user_id, group_name, group_date]
    );
    res.status(201).json(result.rows[0]); // Return the newly created group
  } catch (error) {
    console.error('Error creating exercise group:', error);
    res.status(500).json({ error: 'Failed to create exercise group' });
  }
});

router.post('/:groupId/exercises', async (req, res) => {
  const { group_id, exercise_name, weight, reps, sets } = req.body;
  console.log("Request body:", group_id, exercise_name, weight, reps, sets);
  try{
    const result = await pool.query(
      'INSERT INTO Exercises (group_id, exercise_name, weight, reps, sets) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [group_id, exercise_name, weight, reps, sets]
    );
    console.log("After INSERTING");
    res.status(201).json(result.rows[0]);
  } catch (error){
    console.error('Error creating exercise');
    res.status(500).json({error: 'Failed to add exercise'});
  }
});




  

module.exports = router;
