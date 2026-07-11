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

/**
 * @swagger
 * /threads/{id}:
 *   get:
 *     summary: Get thread by ID
 *     tags:
 *       - Threads
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Thread ID
 *     responses:
 *       200:
 *         description: Thread found successfully
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
 *       404:
 *         description: Thread not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
threadsRouter.get('/:id', ThreadsController.getById);

export default threadsRouter;
