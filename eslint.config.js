import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        ignores: ['node_modules', '.env', '*.sqlite', '**/dist'],

        // prettier-ignore
        rules: {
            // Quality
            'no-unused-vars'                   : 'off',
            'no-undef'                         : 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'eqeqeq'                           : ['warn', 'always'],
            'no-console'                       : ['warn', { allow: ['warn', 'error'] }],
            // Security
            'no-implicit-coercion'             : ['warn', {
                boolean: false,
                number: true,
                string: true
            }],
            'no-eval'                          : 'error',
            'no-unsafe-optional-chaining'      : 'warn',
            'no-param-reassign'                : 'warn',
            'prefer-const'                     : 'warn',
            'prefer-template'                  : 'warn',
            'no-var'                           : 'error',
            'object-shorthand'                 : 'warn',
        },

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                ecmaFeatures: { jsx: true }
            }
        }
    },
    prettier
];
