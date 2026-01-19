export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/js/**/*.js",
    "!src/js/main.js",
    "!src/js/tools/**/*.js"
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/__mocks__/styleMock.js"
  }
};
