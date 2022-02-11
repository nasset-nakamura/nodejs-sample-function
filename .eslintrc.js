module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
  },
};
