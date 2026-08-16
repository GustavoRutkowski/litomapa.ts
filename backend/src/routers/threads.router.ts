import { Router } from 'express';
import ThreadsController from '../controllers/threads.controller.js';
import isLogged from '../middlewares/isLogged.js';

const threadsRouter = Router();

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create a new thread
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Threads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateThread'
 *           example:
 *             title: Sea turtle spotted near mangrove
 *             description: I saw a sea turtle near the mangrove this morning.
 *             species:
 *               - 2
 *               - 5
 *             tags:
 *               - 1
 *               - 3
 *             coords:
 *               longitude: -47.9292
 *               latitude: -15.7801
 *     responses:
 *       201:
 *         description: Thread created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateThreadResponse'
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
threadsRouter.post('/', isLogged, ThreadsController.create);

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
 *             example:
 *               success: true
 *               total: 1
 *               page: 1
 *               data:
 *                 - id: 12
 *                   title: Sea turtle spotted near mangrove
 *                   createdAt: Wed, 22 Jul 2026 12:34:56 GMT
 *                   coords:
 *                     latitude: -30.0346
 *                     longitude: -51.2177
 *                   author:
 *                     id: 1
 *                     username: demo_user_one
 *                     photo: null
 *                   species:
 *                     - id: 2
 *                       name: Tartaruga-marinha
 *                       scientific_name: Chelonia mydas
 *                       group: turtle
 *                   tags:
 *                     - SIGHTING
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
 *             example:
 *               success: true
 *               data:
 *                 id: 12
 *                 title: Sea turtle spotted near mangrove
 *                 createdAt: Wed, 22 Jul 2026 12:34:56 GMT
 *                 coords:
 *                   latitude: -30.0346
 *                   longitude: -51.2177
 *                 author:
 *                   id: 1
 *                   username: demo_user_one
 *                   photo: null
 *                 species:
 *                   - id: 2
 *                     name: Tartaruga-marinha
 *                     scientific_name: Chelonia mydas
 *                     group: turtle
 *                 tags:
 *                   - SIGHTING
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
