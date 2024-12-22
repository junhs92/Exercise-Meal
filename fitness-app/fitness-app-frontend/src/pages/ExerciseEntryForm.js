import React, { useState } from 'react';
import axios from 'axios';

function ExerciseEntryForm({ groupId }) {
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send exercise data to the backend
      await axios.post('http://localhost:5000/api/exerciseGroups/' + groupId + '/exercises', {
        exercise_name: exerciseName,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
      },
    {
        headers: {
            Authorization: 'Bearer ${token}' ,
        }
    });

      // Reset form fields after submission
      setExerciseName('');
      setWeight('');
      setReps('');
      setSets('');
      alert('Exercise added successfully!');
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Failed to add exercise.');
    }
  };

  return (
    <div>
      <h2>Add Exercise to Group {groupId}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Exercise Name:</label>
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reps:</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sets:</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Exercise</button>
      </form>
    </div>
  );
}

export default ExerciseEntryForm;
