import TRuleCallback from '../types/TRuleCallback.js';

interface ICreateStringValidatorOptions {
    required: boolean;
    minSize: number;
    maxSize: number;
    pattern?: RegExp;
    extraRules: TRuleCallback[];
}

export default ICreateStringValidatorOptions;
