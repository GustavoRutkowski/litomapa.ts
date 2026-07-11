import { Router } from 'express';
import ThreadsController from '../controllers/threads.controller.js';

const threadsRouter = Router();

/**
 * @swagger
 * /threads:
 *   get:
 *     summary: Get all threads
 *     tags:
 *       - Threads
 *     responses:
 *       200:
 *         description: Threads found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreadResponse'
 *       400:
 *         description: Generic example of a possible error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
threadsRouter.get('/', ThreadsController.getAll);

export default threadsRouter;
