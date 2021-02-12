module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  automock: false,
  setupFiles: ["./setupJest.js"],

  moduleNameMapper: {
    "/api/helper(.*)": "<rootDir>/tests/unit/__mocks__/helpersMock.ts"
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(eos-transit-lynx-provider|eos-transit-ledger-provider))",
  ]
};
