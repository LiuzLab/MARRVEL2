const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/**',
      '*.log',
      '.env',
      '.env.*',
      'dist/**',
      'build/**',
      'coverage/**',
      '.nyc_output/**'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly'
      }
    },
    rules: {
      // Indentation: 2 spaces, no tabs
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-tabs': 'error',

      // Quotes: single quotes for strings
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

      // Semicolons
      semi: ['error', 'always'],

      // Spacing rules
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': 'error',
      'comma-spacing': ['error', { before: false, after: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],

      // Line endings and formatting
      'eol-last': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],

      // Code quality
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
      'no-console': 'off', // Allow console for server-side logging
      'prefer-const': 'error',
      'no-var': 'error',

      // Naming conventions
      camelcase: ['error', {
        properties: 'always',
        ignoreDestructuring: false,
        ignoreImports: false,
        ignoreGlobals: false
      }],

      // Node.js specific
      'no-process-exit': 'error',
      'handle-callback-err': 'error',

      // Security and Best Practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Error Prevention
      'no-unreachable': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Code Style Standards
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never'],
      'consistent-this': ['error', 'self'],
      'func-call-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'linebreak-style': ['error', 'unix'],
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      'new-parens': 'error',
      'no-array-constructor': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-new-object': 'error',
      'no-unneeded-ternary': 'error',
      'no-whitespace-before-property': 'error',
      'operator-assignment': ['error', 'always'],
      'quote-props': ['error', 'as-needed'],
      'semi-spacing': ['error', { before: false, after: true }],
      'spaced-comment': ['error', 'always'],

      // ES6+ Standards
      'arrow-spacing': ['error', { before: true, after: true }],
      'constructor-super': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-imports': 'error',
      'no-new-symbol': 'error',
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'rest-spread-spacing': ['error', 'never'],
      'template-curly-spacing': ['error', 'never'],

      // Async/Await and Promises
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'warn',

      // Node.js Specific Best Practices
      'callback-return': 'error',
      'no-mixed-requires': 'error',
      'no-new-require': 'error',
      'no-path-concat': 'error',
      'no-process-env': 'off',
      'no-restricted-modules': 'off',

      // Performance
      'no-loop-func': 'error',
      'no-extend-native': 'error',
      'no-proto': 'error',

      // Code Quality Metrics
      'max-depth': ['warn', 4],
      'max-len': ['warn', {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }],
      'max-nested-callbacks': ['warn', 3],
      'max-params': ['warn', 4],
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];
