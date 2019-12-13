export default {
    input: 'src/index.js',

    output: {
        format: 'iife',
        file: 'dist/bundle.js',
    },

    watch: {
      // include and exclude govern which files to watch. by
      // default, all dependencies will be watched
      exclude: ['node_modules/**'],
    },
  };