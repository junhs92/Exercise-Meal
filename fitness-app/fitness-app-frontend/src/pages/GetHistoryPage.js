import React, { useState, useEffect, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

function ExerciseGroups() {
  const [exerciseGroups, setExerciseGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null); // Stores the group ID of the expanded group
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limit, setLimit] = useState(5);

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded ? decoded.userId : null;

  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() -30);

  const defaultEndDate = new Date();

  // Fetch exercise groups
  const fetchExerciseGroups = useCallback(async () => {
    try {
      const params = {
        start_date: startDate || defaultStartDate.toISOString().split('T')[0],
        end_date: endDate || defaultEndDate.toISOString().split('T')[0],
        limit,
      };

      const response = await axios.get(
        `http://localhost:5000/api/exerciseGroups/${userId}/range`,
        { params, headers: { Authorization: `Bearer ${token}` } }
      );
      setExerciseGroups(response.data.exerciseGroups);
    } catch (error) {
      console.error('Error fetching exercise groups:', error);
    }
  }, [userId, token, startDate, endDate, limit]);

  // Fetch exercises for a specific group
  const fetchExercises = async (groupId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/exerciseGroups/${groupId}/exercises`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  };

  // Handle group click to toggle exercises
  const toggleGroup = async (groupId) => {
    if (expandedGroup?.groupId === groupId) {
      setExpandedGroup(null); // Collapse if already expanded
    } else {
      const exercises = await fetchExercises(groupId);
      setExpandedGroup({ groupId, exercises }); // Expand with exercise details
    }
  };

  // Fetch initial data on load
  // useEffect(() => {
  //   if (userId) {
  //       console.log('Fetching with: ', { startDate, endDate, limit});
  //       fetchExerciseGroups();
  //   }
  // }, [userId, startDate, endDate, limit]);

  return (
    <div>
      <h1>Exercise Groups</h1>

      {/* Filters */}
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <label>Number of Groups:</label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          min="1"
        />
        <button onClick={fetchExerciseGroups}>Filter</button>
      </div>

      {/* Exercise Groups */}
      <ul>
        {exerciseGroups.map((group) => (
          <li key={group.id}>
            <strong onClick={() => toggleGroup(group.id)} style={{ cursor: 'pointer' }}>
              {group.group_name} ({new Date(group.group_date).toLocaleDateString()})
            </strong>
            {expandedGroup?.groupId === group.id && (
              <ul>
                {expandedGroup.exercises.length > 0 ? (
                  expandedGroup.exercises.map((exercise) => (
                    <li key={exercise.id}>
                      {exercise.exercise_name}: {exercise.weight > 0 ? (exercise.weight +  "kg,") : ("")} {exercise.reps} reps, {exercise.sets} sets
                    </li>
                  ))
                ) : (
                  <li key="no-exercise">No exercises found for this group.</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExerciseGroups;
