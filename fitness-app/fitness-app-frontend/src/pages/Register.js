import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', form);
      console.log(response.data);
      alert('Registration Successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error during registration', error);

      const errorMessage = error.response?.data?.error || 'Error during registration';
      alert(errorMessage);
    }
  };

  

  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="customer">Customer</option>
        <option value="expert">Expert</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
