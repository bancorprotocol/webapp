module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  
  // preset: "@vue/cli-plugin-unit-jest",
  // moduleFileExtensions: ["js", "ts", "json", "vue", "node"],
  // transform: { 
  //   '^.+\\.vue$': 'vue-jest',
  //   '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
  //     'jest-transform-stub',
  //   "^.+\\.(ts|tsx)$": "ts-jest",
  //   "^.+\\.js$": "babel-jest"
  // },
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // }, 
  // globals: {
  //   'ts-jest': {
  //     babelConfig: true
  //   }
  // },
  transformIgnorePatterns: ['node_modules']

  // transformIgnorePatterns: [
  //   '/node_modules/(?!eos-transit-lynx-provider)'    
  // ]
};
