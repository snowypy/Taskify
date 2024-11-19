const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db');

passport.use(new LocalStrategy((username, password, done) => {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
    if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: 'Incorrect password.' }); }
    return done(null, user);
  });
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  db.get("SELECT * FROM users WHERE githubId = ?", [profile.id], (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      db.run("INSERT INTO users (username, githubId) VALUES (?, ?)", [profile.username, profile.id], function(err) {
        if (err) { return done(err); }
        return done(null, { id: this.lastID, username: profile.username });
      });
    } else {
      return done(null, user);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});