module.exports = {
    name: "Hifumi",
    verbose: true,
    testEnvironment: "node",
    collectCoverage: true,
    rootDir: 'dist',
    coverageDirectory: "./coverage",
    testRegex: '(.+).spec.js',
    collectCoverageFrom: [
        "dist/**/*.js",
    ],
    coveragePathIgnorePatterns: [
        "**/node_modules/**",
        "dist/database/",
        "src/.*",
    ],
    testPathIgnorePatterns: [
        "node_modules/",
        "src/.*"
    ],
    moduleFileExtensions: [
        "js",
        "spec.js",
        "json",
        "node"
    ],
    moduleDirectories: [
        "node_modules"
    ]
};
