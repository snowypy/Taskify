import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './AuthPage.css';
import googleIcon from './icons/google-icon.svg';
import githubIcon from './icons/github-icon.svg';

function SignupPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = () => {
    fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/login';
        } else {
          setError(data.error || 'Signup failed. Please try again.');
        }
      })
      .catch(() => setError('Signup failed. Please try again.'));
  };

  return (
    <motion.div className="auth-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="auth-box" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 50 }}>
        <h1 className="auth-title">Signup</h1>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-form">
          <input type="text" name="username" placeholder="Username" onChange={handleInputChange} className="auth-input" />
          <input type="password" name="password" placeholder="Password" onChange={handleInputChange} className="auth-input" />
          <button onClick={handleSignup} className="auth-button">Signup</button>
        </div>
        <div className="oauth-buttons">
          <button className="oauth-button" disabled>
            <img src={googleIcon} alt="Google Icon" width="20" height="20" />
            Signup with Google
          </button>
          <button className="oauth-button" disabled>
            <img src={githubIcon} alt="GitHub Icon" width="20" height="20" />
            Signup with GitHub
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SignupPage;