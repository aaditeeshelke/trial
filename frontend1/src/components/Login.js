import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Login.css'; // Import CSS file for styling



const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        // Redirect based on user role
        navigate(data.redirect);
        // Handle login time as needed in your application
        console.log('Login time:', data.loginTime);
        // You can store loginTime in state or wherever required
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p> {/* Link to the registration page */}
    </div>
  );
};

export default Login;
