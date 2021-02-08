module.exports = {
    extends: ["airbnb/base", "prettier"],
    parser: "babel-eslint",
    ignorePatterns: ["/dist/**"],
    rules: {
        "prettier/prettier": "error",
        "arrow-body-style": ["error", "as-needed"],
        complexity: ["error", 20],
        "no-param-reassign": "off",
        "import/prefer-default-export": "off",
        curly: "error",
        "no-await-in-loop": "off",
        "no-restricted-syntax": "off",
        "default-case": "off",
        eqeqeq: ["error", "always"],
        "func-style": ["error", "expression"],
        "generator-star-spacing": ["error", { before: false, after: true }],
        "jsx-quotes": ["error", "prefer-double"],
        "max-depth": ["error", 10],
        "newline-before-return": "error",
        "no-alert": "error",
        "no-confusing-arrow": ["error", { allowParens: false }],
        "no-constant-condition": "error",
        "no-console": "off",
        "no-empty-function": "error",
        "no-eq-null": "error",
        "no-implicit-coercion": [
            "error",
            { boolean: false, number: true, string: true, allow: [] },
        ],
        "no-invalid-this": "error",
        "no-magic-numbers": "off",
        "no-process-exit": "error",
        "no-restricted-imports": ["error", "lodash"],
        "no-undefined": "error",
        "no-underscore-dangle": ["error", { allow: ["__INIT_MATERIAL_UI__"] }],
        "no-unmodified-loop-condition": "error",
        "no-useless-call": "error",
        "no-warning-comments": [
            "warn",
            {
                terms: ["todo", "fixme"],
                location: "anywhere",
            },
        ],
        "require-atomic-updates": "error",
        "require-await": "error",
        "require-unicode-regexp": "error",
        "template-curly-spacing": ["error", "never"],
        "import/default": "error",
        "import/exports-last": "error",
        "import/extensions": [
            "error",
            "always",
            {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
                json: "never",
            },
        ],
        "import/max-dependencies": ["error", { max: 20 }],
        "import/no-unassigned-import": "error",
        "import/no-unused-modules": [
            "error",
            { missingExports: true, unusedExports: true },
        ],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                ],
                "newlines-between": "never",
            },
        ],
        "filenames/match-exported": ["error", "kebab"],
        "filenames/match-regex": ["error", "(^[a-z-]*[a-z]+$)|(.config$)"],
    },
    overrides: [
        {
            files: [
                "jest.config.js",
                "jest.setup.js",
                "rollup.config.js",
                ".eslintrc.js",
            ],
            rules: {
                "filenames/match-exported": "off",
                "filenames/match-regex": "off",
                "import/no-unused-modules": "off",
                "no-magic-numbers": "off",
            },
        },
        {
            files: ["*.test.js", "*.test.jsx"],
            rules: {
                "filenames/match-regex": "off",
                "import/no-unused-modules": "off",
                "no-process-env": "off",
                "no-undefined": "off",
                "no-magic-numbers": "off",
            },
        },
        {
            files: ["src/cli.js", "src/index.js"],
            rules: {
                "import/no-unused-modules": "off",
            },
        },
        {
            files: ["__mocks__/**/*"],
            rules: {
                "filenames/match-exported": "off",
                "filenames/match-regex": "off",
                "import/no-unused-modules": "off",
            },
        },
    ],
    plugins: ["prettier", "import", "filenames"],
    env: {
        node: true,
        jest: true,
    },
};
