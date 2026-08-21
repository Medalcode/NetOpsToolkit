export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/core/**/*.js",
    "src/platform/**/*.js",
    "src/ui/shared/**/*.js"
  ],
  coverageThreshold: {
    "./src/core/": {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    },
    global: {
      statements: 15,
      branches: 10,
      functions: 15,
      lines: 15
    }
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "^jspdf$": "<rootDir>/tests/__mocks__/jspdfMock.js",
    "^jspdf-autotable$": "<rootDir>/tests/__mocks__/jspdfMock.js"
  }
};
