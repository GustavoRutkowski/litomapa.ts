import { OPTIONAL_FIELD_RULE, POSITIVE_RULE } from './rules';
import { createImageValidator, createIntValidator } from './validators';

export const validateId = createIntValidator('id', 'params', [POSITIVE_RULE]);
export const validateImage = createImageValidator('image', [OPTIONAL_FIELD_RULE]);
