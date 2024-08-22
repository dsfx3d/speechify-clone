/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testMatch: ["<rootDir>/**/*.test.ts"],
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./",
        outputName: "server-test-results.xml",
      },
    ],
  ],
};
