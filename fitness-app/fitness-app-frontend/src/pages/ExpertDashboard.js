import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FeedbackDisplay from './FeedbackDisplay';

function ExpertDashboard() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/expert-data', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setClients(response.data.clients);
    })
    .catch((error) => console.error('Error fetching expert data:', error));
  }, []);

  const handleSelectClient = (clientId) => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/api/client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setSelectedClient(response.data.client);
      setFeedback(response.data.feedback);
    })
    .catch((error) => console.error('Error fetching client data:', error));
  };

  return (
    <div>
      <h1>Expert Dashboard</h1>
      <div>
        <h2>Client Overview</h2>
        <ul>
          {clients.map(client => (
            <li key={client.id}>
              {client.username} <button onClick={() => handleSelectClient(client.id)}>View</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedClient && (
        <div>
          <h2>Client Data Access</h2>
          <p>{selectedClient.username}'s Data</p>
          {/* Display client-specific data */}
          <h3>Feedback and Trends</h3>
          <p>{feedback}</p>
        </div>
        <FeedbackDisplay feedback={feedback} />
      )}
    </div>
  );
}

export default ExpertDashboard;
