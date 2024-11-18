import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './SplashPage.css';

function SplashPage() {
  return (
    <motion.div 
      className="splash-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1 
        className="splash-title"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        Welcome to Taskify
      </motion.h1>
      <motion.div 
        className="splash-buttons"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <Link to="/signup">
          <motion.button 
            className="splash-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Sign Up
          </motion.button>
        </Link>
        <Link to="/login">
          <motion.button 
            className="splash-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Login
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default SplashPage;