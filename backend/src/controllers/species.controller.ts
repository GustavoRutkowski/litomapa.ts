import { Request, Response } from 'express';
import SpeciesService from '../services/species.service.js';
import { SpeciesQuerySchema } from '../schemas/species.schemas.js';
import U from '../utils/UnknownError.js';
import { formatErrors } from '../utils/formatErrors.js';

export default class SpeciesController {
    static async getAll(req: Request, res: Response) {
        const result = SpeciesQuerySchema.safeParse(req.query);

        if (!result.success) {
            const errors = formatErrors(result.error);
            return res.status(400).json({ success: false, errors });
        }

        try {
            const data = await SpeciesService.findAll(result.data);
            res.status(200).json({ success: true, data });
        } catch (e) {
            const status = U.getHttpStatus(e);
            const errors = { global: [U.getMessage(e)] };
            res.status(status).json({ success: false, errors });
        }
    }
}
