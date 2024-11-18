const express = require('express');
const db = require('../db');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.use(ensureAuthenticated);

router.get('/', (req, res) => {
    const userId = req.user.id;
    console.log('Fetching tasks for user:', userId);
    db.all("SELECT * FROM tasks WHERE userId = ?", [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ tasks: rows });
    });
});

router.post('/', (req, res) => {
    const { title, description, status, tags, categoryId } = req.body;
    const userId = req.user.id;
    console.log('Adding task for user:', userId, title);
    db.run("INSERT INTO tasks (title, description, status, tags, categoryId, userId) VALUES (?, ?, ?, ?, ?, ?)", [title, description, status, tags, categoryId, userId], function(err) {
        if (err) {
            console.error('Error adding task:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

router.put('/:id', (req, res) => {
    const { title, description, status, tags, categoryId } = req.body;
    const userId = req.user.id;
    console.log('Updating task for user:', userId, req.params.id);
    db.run("UPDATE tasks SET title = ?, description = ?, status = ?, tags = ?, categoryId = ? WHERE id = ? AND userId = ?", [title, description, status, tags, categoryId, req.params.id, userId], function(err) {
        if (err) {
            console.error('Error updating task:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

router.delete('/:id', (req, res) => {
    const userId = req.user.id;
    console.log('Deleting task for user:', userId, req.params.id);
    db.run("DELETE FROM tasks WHERE id = ? AND userId = ?", [req.params.id, userId], function(err) {
        if (err) {
            console.error('Error deleting task:', err.message);
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

module.exports = router;