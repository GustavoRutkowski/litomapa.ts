import { Request, Response } from 'express';

type TBody = object;
type TRequestInput = Request['params'] | Request['query'] | TBody;

interface IValidation {
    required?: string[];
    allowed?: string[];
}

abstract class Controller {
    protected static validate(
        input: TRequestInput,
        validation: IValidation,
        res: Response
    ): boolean {
        if (validation.required && !this.required(validation.required, input, res)) return false;
        if (validation.allowed && !this.allowed(validation.allowed, input, res)) return false;
        return true;
    }

    protected static required(fields: string[] = [], input: TRequestInput, res: Response): boolean {
        const missingFields = fields.filter(field => !(field in input));
        if (missingFields.length <= 0) return true;

        res.status(400).json({
            success: false,
            message: `The following fields are required: ${missingFields.join(', ')}`
        });

        return false;
    }

    protected static allowed(fields: string[] = [], input: TRequestInput, res: Response): boolean {
        const invalidFields = Object.keys(input).filter(field => !fields.includes(field));
        if (invalidFields.length <= 0) return true;

        res.status(400).json({
            success: false,
            message: `The valid fields are: ${fields.join(', ')}`
        });

        return false;
    }
}

export default Controller;
