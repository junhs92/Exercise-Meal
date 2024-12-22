import React, { useState, useEffect } from 'react';
import { jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClientDashboard({selectedGroupId}) {
  const [user, setUser] = useState(null);
  const [exerciseGroups, setExerciseGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      try{
        const decoded = jwtDecode(token);
    
        setUser({
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role
        });

        console.log("User name: ", decoded.username);


        // Fetch client data from the backend
        axios.get(`http://localhost:5000/api/users/${decoded.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((error) => console.error('Error fetching client data:', error));

        //fetch exercise groups for the user
        axios.get(`http://localhost:5000/api/exerciseGroups/${decoded.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(async(response) => {
            const groups = response.data.exerciseGroups;
            console.log("group: ", groups);
            setExerciseGroups(groups);  // Set exercise groups in state

            const exerciseData = {};
            await Promise.all(
              groups.map(async(group) => {
                const exerciseRes = await axios.get(
                  `http://localhost:5000/api/exerciseGroups/${group.id}/exercises`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                exerciseData[group.id] = exerciseRes.data.exercises;
              })
            );

            setExercises(exerciseData);
          })
          .catch((error) => console.error('Error fetching exercise groups:', error));
        } catch(error){
          console.error('Failed to decode token:', error);
          localStorage.removeItem('token');
          navigate('/login');
      }
    } else {
      console.error('No token found. Redirecting to login.');
      navigate('/login');
      // Optionally redirect to login page if no token
    }
  }, [navigate]);


  return (
    <div>
      <h1>Client Dashboard</h1>
      {user && <h2>Welcome, {user.username}!</h2>}

      {/* Add Exercise Button */}
      <button onClick={() => navigate('/add-exercise')}>운동 기록하기</button>

      {/* Display Exercise Groups */}
      <div>
        <h2>최근 운동 기록</h2>
        {exerciseGroups.length > 0 ? (
          <ul>
            {exerciseGroups.map((group) => (
              <li key={group.id}>
                <strong>{group.group_name}</strong> - {new Date(group.group_date).toLocaleDateString()}
                <ul>
                  <h4>상세 운동 기록</h4>
                  {exercises[group.id] && exercises[group.id].length > 0 ? (
                    exercises[group.id].map((exercise) => (
                      <li key={exercise.id}>
                        {exercise.exercise_name}: {exercise.weight > 0 ? (exercise.weight +  "kg,") : ("")} {exercise.reps} reps, {exercise.sets} sets
                      </li>
                    ))
                    ) : (
                      <li key="No exercise Records">운동 기록이 없습니다.</li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p>운동 그룹 기록이 없습니다.</p>
        )}
      </div>

      {/* See History Button */}
      <button onClick={() => navigate('/get-history')}>과거 운동 기록 확인하기</button>

      
    </div>
  );
}

export default ClientDashboard;
