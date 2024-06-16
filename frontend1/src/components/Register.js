import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "" 
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Registration successful!");
        navigate('/login');
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} />
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
      
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
