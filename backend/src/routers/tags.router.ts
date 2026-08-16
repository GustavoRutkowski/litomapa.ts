import { Router } from 'express';
import TagController from '../controllers/tags.controller.js';

const tagsRouter = Router();

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: List all tags
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: Tags found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: SIGHTING
 */
tagsRouter.get('/', TagController.getAll);

export default tagsRouter;
