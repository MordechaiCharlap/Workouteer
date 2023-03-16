module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "object-curly-spacing": [2, "always"],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        imports: "only-multiline",
        exports: "only-multiline",
        functions: "only-multiline",
      },
    ],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quote-props": "off",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    indent: "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
