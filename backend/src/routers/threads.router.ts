import { Router } from 'express';
import ThreadsController from '../controllers/threads.controller.js';

const threadsRouter = Router();

/**
 * @swagger
 * /threads:
 *   get:
 *     summary: List threads
 *     tags:
 *       - Threads
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of items to return
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag name
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author username
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by thread title
 *     responses:
 *       200:
 *         description: Threads found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ThreadsResponse'
 *       400:
 *         description: Invalid query parameters
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
 *         description: Invalid thread ID
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
