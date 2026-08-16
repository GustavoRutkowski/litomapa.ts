import { Router } from 'express';
import SpeciesController from '../controllers/species.controller.js';

const speciesRouter = Router();

/**
 * @swagger
 * /species:
 *   get:
 *     summary: List all species
 *     tags:
 *       - Species
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter species by name, scientific name or group
 *     responses:
 *       200:
 *         description: Species found successfully
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
 *                         example: Tartaruga-marinha
 *                       scientific_name:
 *                         type: string
 *                         example: Chelonia mydas
 *                       group:
 *                         type: string
 *                         example: turtle
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
speciesRouter.get('/', SpeciesController.getAll);

export default speciesRouter;
