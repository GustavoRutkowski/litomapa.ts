import express, { json } from 'express';
import cors from 'cors';
import usersRouter from './routers/users.routes.js';

const app = express();

app.use(json());
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
// Routers:
app.use('/users', usersRouter);

// Server:
const API_PORT: number = Number(process.env.API_PORT) || 4444;
const API_HOST: string = process.env.API || 'localhost';

app.listen(API_PORT, API_HOST, () => {
    console.log(`API server running in port ${API_PORT}...`);
});
