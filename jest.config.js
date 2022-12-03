/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@components/(.*)$": "<rootDir>/components/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@pages/(.*)$": "<rootDir>/pages/$1",
    "^@api-contracts/(.*)$": "<rootDir>/api-contracts/$1",
    "^@business-logic/(.*)$": "<rootDir>/business-logic/$1",
    "^@app-store/(.*)$": "<rootDir>/app-store/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: ["**/business-logic/**"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async

module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: [
    // The regex below is just a guess, you might tweak it
    "node_modules/(?!(rehype-parse|hast-util-from-parse5|hastscript|property-information|hast-util-parse-selector|space-separated-tokens|comma-separated-tokens|vfile-location|web-namespaces|rehype-sanitize|hast-util-sanitize|rehype-stringify|hast-util-to-html|html-void-elements|hast-util-is-element|unist-util-is|hast-util-whitespace|stringify-entities|character-entities-legacy|character-entities-html4|ccount|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position)/)",
  ],
});
