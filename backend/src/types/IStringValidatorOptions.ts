import TRuleCallback from './TRuleCallback.js';

interface IStringValidatorOptions {
    required: boolean;
    minSize: number;
    maxSize: number;
    pattern?: RegExp;
    extraRules: TRuleCallback[];
}

export default IStringValidatorOptions;
