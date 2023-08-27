/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  env: {
    node: true
  },
  rules: {
    "semi": "off",
    "@typescript-eslint/semi": "error",
    "quotes": "off",
    "@typescript-eslint/quotes": "error"
  }
};
