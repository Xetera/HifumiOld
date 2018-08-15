module.exports = {
    name: "Hifumi",
    verbose: true,
    testEnvironment: "node",
    collectCoverage: true,
    coverageDirectory: "./coverage",
    collectCoverageFrom: [
        "dist/**/*.js",
    ],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "dist/database/"
    ],
    testMatch: [
        "dist/__tests__/**/*.spec.js"
    ],
    moduleFileExtensions: [
        "js",
        "json",
        "node"
    ]
};
