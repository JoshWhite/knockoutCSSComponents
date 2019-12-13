module.exports = function (wallaby) {
    return {
      files: [
          'test.js',
        // 'js/**/*.js',
        // '!js/**/*.test.js',
      ],
 
      tests: [
        'js/**/*.test.js',
      ],

      env: {
        type: 'node',
        runner: 'node'
      },

      debug: true,
  
      compilers: {
        '**/*.js?(x)': wallaby.compilers.babel()
      },

      testFramework: 'jest',
    };
  };