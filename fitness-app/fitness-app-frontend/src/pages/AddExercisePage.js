import React, { useState } from 'react';
import { jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddExercisePage() {
  const [exerciseGroup, setExerciseGroup] = useState('');
  const [exerciseDetails, setExerciseDetails] = useState({ name: '', weight: '', reps: '', sets: '' });
  const [exerciseBuffer, setExerciseBuffer] = useState([]);
  const navigate = useNavigate();

  // Handle changes to exercise details
  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setExerciseDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Add the current exercise to the buffer
  const addExerciseToBuffer = () => {
    setExerciseBuffer((prevBuffer) => [...prevBuffer, exerciseDetails]);
    setExerciseDetails({ name: '', weight: '', reps: '', sets: '' }); // Clear the input fields
  };

  // Save the exercise group and buffered exercises to the database
  const saveExercises = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Create the exercise group
      const groupResponse = await axios.post(
        `http://localhost:5000/api/exerciseGroups`,
        { user_id: userId, group_name: exerciseGroup, group_date: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("group response.data.group: ", groupResponse.data.id);
      
      const groupId = groupResponse.data.id;

      // Add each exercise in the buffer to the exercise group
      for (const exercise of exerciseBuffer) {
        console.log("name of the Exercise: ", exercise.name);
        try {
          await axios.post(
            `http://localhost:5000/api/exerciseGroups/${groupId}/exercises`,
            {
              group_id: groupId,
              exercise_name: exercise.name,
              weight: exercise.weight,
              reps: exercise.reps,
              sets: exercise.sets,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Error saving exercise:', exercise.name, error);
          throw new Error(`Failed to save exercise: ${exercise.name}`);
        }
      }

      // Clear buffer and exercise group input
      setExerciseBuffer([]);
      setExerciseGroup('');

      alert('Exercises saved successfully!');
      navigate('/clientdashboard'); // Redirect back to the dashboard
    } catch (error) {
      console.error('Error saving exercises:', error);
      alert('Failed to save exercises.');
    }
  };

  return (
    <div>
      <h1>Add New Exercise Group</h1>

      {/* Exercise Group Input */}
      <input
        type="text"
        placeholder="Exercise Group Name"
        value={exerciseGroup}
        onChange={(e) => setExerciseGroup(e.target.value)}
      />

      {/* Exercise Details Input */}
      <div>
        <h2>Add Exercise Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Exercise Name"
          value={exerciseDetails.name}
          onChange={handleExerciseChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          value={exerciseDetails.weight}
          onChange={handleExerciseChange}
        />
        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={exerciseDetails.reps}
          onChange={handleExerciseChange}
        />
        <input
          type="number"
          name="sets"
          placeholder="Sets"
          value={exerciseDetails.sets}
          onChange={handleExerciseChange}
        />

        <button onClick={addExerciseToBuffer}>More</button>
        <button onClick={saveExercises}>Save</button>
      </div>

      {/* Display Exercise Buffer */}
      <h3>Exercises to be Added</h3>
      <ul>
        {exerciseBuffer.map((exercise, index) => (
          <li key={index}>
            {exercise.name} - {exercise.weight} kg, {exercise.reps} reps, {exercise.sets} sets
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddExercisePage;
