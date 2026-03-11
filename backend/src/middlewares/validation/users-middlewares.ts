import ICreateStringValidatorOptions from '../../interfaces/ICreateStringValidatorOptions.js';
import { REQUIRE_LETTERS_RULE, REQUIRE_NUMBERS_RULE, REQUIRED_FIELD_RULE } from '../rules.js';
import { createImageValidator, createStringValidator } from '../validators.js';

const validateUsername = createStringValidator('username', 'body', {
    minSize: 3, maxSize: 60
} as ICreateStringValidatorOptions);

const validateEmail = createStringValidator('email', 'body', {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
} as ICreateStringValidatorOptions);

const validatePassword = createStringValidator('password', 'body', {
    minSize: 6,
    extraRules: [REQUIRE_LETTERS_RULE, REQUIRE_NUMBERS_RULE]
} as ICreateStringValidatorOptions);

const validatePhoto = createImageValidator('photo', [REQUIRED_FIELD_RULE]);
const validateUser = [validateUsername, validateEmail, validatePassword];

export { validateUsername, validateEmail, validatePassword, validatePhoto };
export default validateUser;
