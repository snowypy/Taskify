const express = require('express');
const db = require('../db');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', (req, res) => {
    const userId = req.user.id;
    console.log('Fetching categories for user:', userId);
    db.all("SELECT * FROM categories WHERE userId = ?", [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching categories:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ categories: rows });
    });
});

router.post('/', (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    console.log('Adding category for user:', userId, name);
    db.run("INSERT INTO categories (name, userId) VALUES (?, ?)", [name, userId], function(err) {
        if (err) {
            console.error('Error adding category:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

module.exports = router;