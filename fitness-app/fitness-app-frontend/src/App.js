import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ClientDashboard from './pages/ClientDashboard';
import AddExercisePage from './pages/AddExercisePage';
import GetHistoryPage from './pages/GetHistoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/add-exercise" element={<AddExercisePage />} />
        <Route path="/get-history" element={<GetHistoryPage/>} />
        <Route path="/" element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;
