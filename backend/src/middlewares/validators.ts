import { Request, Response, NextFunction } from 'express';
import newRule, {
    REQUIRED_FIELD_RULE,
    OPTIONAL_FIELD_RULE,
    INT_FIELD_RULE,
    FLOAT_FIELD_RULE
} from './rules.js';
import TMiddleware from '../types/TMiddleware.js';
import TRuleCallback from '../types/TRuleCallback.js';
import IStringValidatorOptions from '../types/IStringValidatorOptions.js';

type TRequestEntry = 'body' | 'query' | 'params';
type TValidatorOptions = IStringValidatorOptions | TRuleCallback[];
type TValidator = (field: string, input: TRequestEntry, options: TValidatorOptions) => TMiddleware;

// Validators:

const createValidator: TValidator = (field, input, rules = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dataset = req[input];

        for (const rule of rules as TRuleCallback[]) {
            const value = dataset && field in dataset ? dataset[field] : null;
            const response = rule(field, value, dataset, next);

            if (response === true) continue;
            if (response === undefined) return; // Caso a rule chame next()
            return res.status(400).json({ success: false, message: response });
        }

        return next();
    };
};

// Gera um middleware de validação para um inteiro
export const createIntValidator: TValidator = (field, input, rules = []) =>
    createValidator(field, input, [INT_FIELD_RULE, ...(rules as TRuleCallback[])]);

// Gera um middleware de validação para um float
export const createFloatValidator: TValidator = (field, input, rules = []) =>
    createValidator(field, input, [FLOAT_FIELD_RULE, ...(rules as TRuleCallback[])]);

export const createStringValidator: TValidator = (field, input, options) => {
    const {
        required = true,
        minSize = 0,
        maxSize = Infinity,
        pattern,
        extraRules = []
    } = options as IStringValidatorOptions;

    const FIRST_RULE = required ? REQUIRED_FIELD_RULE : OPTIONAL_FIELD_RULE;

    const MIN_RULE: TRuleCallback = (field, value) => {
        if (value.length >= minSize) return true;
        return `The "${field}" must have at least ${minSize} characters`;
    };

    const MAX_RULE: TRuleCallback = (field, value) => {
        if (value.length <= maxSize) return true;
        return `The "${field}" must have at most ${maxSize} characters`;
    };

    const MATCH_RULE: TRuleCallback = (field, value) => {
        if (value.match(pattern)) return true;
        return `The "${field}" has an invalid format`;
    };

    const rules = [FIRST_RULE, MIN_RULE, MAX_RULE, ...extraRules];
    if (pattern) rules.push(MATCH_RULE);
    return createValidator(field, input, rules);
};

export const createImageValidator = (field: string, rules: TRuleCallback[] = []) => {
    const validatorRules = [
        ...rules,
        newRule((field, value) => {
            if ('filename' in value) return true;
            return `The ${field} field must contain "filename" property`;
        }),
        newRule((field, value) => {
            if ('base64' in value) return true;
            return `The ${field} field must contain "base64" property`;
        })
    ];
    return createValidator(field, 'body', validatorRules);
};

export default createValidator;
