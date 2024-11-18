const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const categoryRoutes = require('./routes/categories');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require('./auth');

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/categories', categoryRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});