import { OPTIONAL_FIELD_RULE, POSITIVE_RULE } from './rules.js';
import { createImageValidator, createIntValidator } from './validators.js';

export const validateId = createIntValidator('id', 'params', [POSITIVE_RULE]);
export const validateImage = createImageValidator('image', [OPTIONAL_FIELD_RULE]);
