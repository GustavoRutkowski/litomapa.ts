import TRuleCallback from '../types/TRuleCallback.js';

export const REQUIRED_FIELD_RULE: TRuleCallback = (field, _, dataset) => {
    if (field && dataset && field in dataset) return true;
    return `The '${field}' field is required`;
};

export const OPTIONAL_FIELD_RULE: TRuleCallback = (field, _, dataset, next) => {
    if (field && dataset && field in dataset) return true;
    next?.();
};

export const INT_FIELD_RULE: TRuleCallback<number> = (field, value) => {
    if (!value) return `The '${field}' field must be a integer number`;
    if (value === null) return true;
    if (Number.isInteger(value)) return true;
    if (Number.isInteger(parseInt(value.toString()))) return true;
    return `The '${field}' field must be a integer number`;
};

export const FLOAT_FIELD_RULE: TRuleCallback = (field, value) => {
    if (value === null) return true;
    if (typeof value === 'number' && !Number.isNaN(value)) return true;
    return `The '${field}' field must be a float number`;
};

export const NEGATIVE_RULE: TRuleCallback<number> = (field, value) => {
    if (value && value < 0) return true;
    return `The '${field}' field must be a negative number`;
};

export const POSITIVE_RULE: TRuleCallback<number> = (field, value) => {
    if (value && value > 0) return true;
    return `The '${field}' field must be a positive number`;
};

export const NOT_NEGATIVE_RULE: TRuleCallback<number> = (field, value) => {
    if (value && value >= 0) return true;
    return `The '${field}' field cannot be negative`;
};

export const NOT_POSITIVE_RULE: TRuleCallback<number> = (field, value) => {
    if (value && value <= 0) return true;
    return `The '${field}' field cannot be positive`;
};

export const REQUIRE_LETTERS_RULE: TRuleCallback<string> = (field, value) => {
    const hasLetters = /[a-zA-Z]/.test(value || '');
    if (hasLetters) return true;
    return `The '${field}' field must contain letters`;
};

export const REQUIRE_NUMBERS_RULE: TRuleCallback<string> = (field, value) => {
    const hasNumbers = /[0-9]/.test(value || '');
    if (hasNumbers) return true;
    return `The '${field}' field must contain numbers`;
};

const newRule = (cb: TRuleCallback) => cb;
export default newRule;
