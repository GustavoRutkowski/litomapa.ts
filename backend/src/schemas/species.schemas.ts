import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SpeciesQuerySchema = z
    .object({
        search: z
            .string()
            .trim()
            .transform(value => (value === '' ? undefined : value))
            .optional()
            .openapi({
                description: 'Search species by name, scientific name or group',
                example: 'turtle'
            })
    })
    .openapi('SpeciesQuery');
