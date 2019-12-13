module.exports = {
    'parser': 'babel-eslint',
    'env': {
        'browser': true,
        'node': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'rules': {
        'linebreak-style': [
            'error',
            'windows'
        ],
        'no-var': [
            'error'
        ],
        'strict': ['error', 'never'],
        'quotes': ['error', 'single'],
        'comma-dangle': ['error', {
            'arrays': 'always-multiline',
            'objects': 'always-multiline',
            'imports': 'always-multiline',
            'exports': 'always-multiline',
            'functions': 'never'
        }],
        'jsx-quotes': ['error', 'prefer-single'],
        'semi': 'error',
    },
    'plugins': [
        'jest'
    ]
};
