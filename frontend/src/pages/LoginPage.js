import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import './AuthPage.css';
import googleIcon from './icons/google-icon.svg';
import githubIcon from './icons/github-icon.svg';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = () => {
    console.log('Logging in:', formData.username);
    fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Login successful:', formData.username);
          history.push('/tasks');
        } else {
          console.error('Login failed:', data.error);
          setError(data.error || 'Login failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        setError('Login failed. Please try again.');
      });
  };

  return (
    <motion.div className="auth-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="auth-box" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 50 }}>
        <h1 className="auth-title">Login</h1>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-form">
          <input type="text" name="username" placeholder="Username" onChange={handleInputChange} className="auth-input" />
          <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="auth-input" />
          <button onClick={handleLogin} className="auth-button">Login</button>
        </div>
        <div className="oauth-buttons">
          <button className="oauth-button" disabled>
            <img src={googleIcon} alt="Google Icon" width="20" height="20" />
            Login with Google
          </button>
          <button className="oauth-button" disabled>
            <img src={githubIcon} alt="GitHub Icon" width="20" height="20" />
            Login with GitHub
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default LoginPage;