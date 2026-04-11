import express, { json } from 'express';
import cors from 'cors';
import usersRouter from './routers/users.routes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(json());
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));

app.get('/', (req, res) => res.redirect('/docs'));

// Routers:
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(join(__dirname, 'uploads')));
app.use('/users', usersRouter);

// Server:
const API_PORT: number = Number(process.env.API_PORT) || 4444;
const API_HOST: string = process.env.API || 'localhost';

app.listen(API_PORT, API_HOST, () => {
    console.log(`API server running in port ${API_PORT}...`);
});
