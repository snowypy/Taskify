const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  console.log('Signup request:', username);
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
    if (err) {
      console.error('Signup error:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    const userId = this.lastID;
    db.run("INSERT INTO categories (name, userId) VALUES (?, ?)", ['Default Category', userId], function(err) {
      if (err) {
        console.error('Error creating default category:', err.message);
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    });
  });
});

router.post('/login', (req, res, next) => {
  console.log('Login request:', req.body.username);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Login error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      console.error('Login failed: Invalid username or password');
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err.message);
        return res.status(400).json({ error: err.message });
      }
      console.log('Login successful:', user.username);
      return res.json({ success: true });
    });
  })(req, res, next);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req, res) => {
  console.log('GitHub login successful:', req.user.username);
  res.redirect('/');
});

module.exports = router;