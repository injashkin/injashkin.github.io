export default {
  input: 'src/index.js',

  watch: {
    include: './src/**',
    clearScreen: false,
  },

  output: {
    file: 'docs/index.1gggaam3o.js', //- эта строка обрабатывается регулярным выражением в scripts.js
    format: 'iife',
  },
};
