import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState({username: '', email: '', role: ''});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first!');
      navigate('/login');
    } else {
      axios
        .get('http://localhost:5000/api/users', { 
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        })
        .then((response) =>{
            console.log('User data response: ', response.data);
            
            const userData = {
              username: response.data[0].username || '',
              email: response.data[0].email || '',
              role: response.data[0].role || ''
            };
            setUser(userData);
            console.log('set User value: ', userData);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          alert('Failed to fetch user data. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [navigate]);
  
    // Log `user` when it changes to confirm update
    useEffect(() => {
      console.log('Updated user state:', user);
    }, [user]);

  return (
    <div>
    <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p> {/* Display user username */}
          <p>Email: {user.email}</p>
          <p>Status: {user.role}</p>
        </div>
      ) : (
        <p>Loading user data...</p> // Show loading message while fetching
      )}
    </div>
  );
}

export default Dashboard;
