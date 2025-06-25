/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  silent: true,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/dist"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
