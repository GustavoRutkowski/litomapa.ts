import { z, ZodError } from 'zod';

export type ValidationErrors = { global: string[] } & Record<string, string[]>;

export function formatErrors(error: ZodError): ValidationErrors {
    const { formErrors, fieldErrors } = z.flattenError(error);
    return { global: formErrors, ...fieldErrors };
}
