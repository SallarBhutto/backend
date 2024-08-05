module.exports = {
    // other configurations...
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      // if you use other aliases, add them here
    },
    moduleDirectories: ['node_modules', 'src'],
  };
  