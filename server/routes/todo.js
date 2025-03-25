import express from 'express';
import { query } from '../helpers/db.js';

const todoRouter = express.Router();

todoRouter.get('/', async (_, res) => {
    try {
        const tasks = await query('SELECT * FROM task');
        const rows = tasks.rows ? tasks.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

todoRouter.post('/new', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const newTask = await query('INSERT INTO task (description) VALUES ($1) RETURNING *', [description]);
        res.status(201).json(newTask.rows[0]);
    } catch (error) {
        console.error('Error creating new task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

todoRouter.delete('/delete/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }

    try {
        const result = await query('DELETE FROM task WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', task: result.rows[0] });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = todoRouter;