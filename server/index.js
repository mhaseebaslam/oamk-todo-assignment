import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import todoRouter from './routes/todo.js';

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Adds security headers
app.use(morgan('combined')); // Logs HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', todoRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});