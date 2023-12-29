module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "airbnb-base"],
  overrides: [
    {
      files: [".eslintrc.{js,cjs}"],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    quotes: ["error", "double", { avoidEscape: true }],
    "import/order": "off",
  },
};
