module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  automock: false,
  setupFiles: ["./setupJest.js"],

  // preset: "@vue/cli-plugin-unit-jest",
  // moduleFileExtensions: ["js", "ts", "json", "vue", "node"],
  // transform: {
  //   '^.+\\.vue$': 'vue-jest',
  //   '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
  //     'jest-transform-stub',
  //   "^.+\\.(ts|tsx)$": "ts-jest",
  //   "^.+\\.js$": "babel-jest"
  // },
  // transformIgnorePatterns: ['node_modules']

  transformIgnorePatterns: [
    "/node_modules/(?!(eos-transit-lynx-provider|eos-transit-ledger-provider))"
  ]
};
