module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  extends: ["next", "next/core-web-vitals", "xo", "xo-typescript", "xo-react"],
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },

  plugins: ["@typescript-eslint"],

  rules: {
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/triple-slash-reference": "off",
    "react/function-component-definition": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-tag-spacing": "off",
    "@typescript-eslint/naming-convention": "off",
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/indent": "off",
    "no-mixed-spaces-and-tabs": "off",
    "@typescript-eslint/space-infix-ops": "off",
    "operator-linebreak": "off",
    "jsx-quotes": "off",
    "@typescript-eslint/ban-types": "off",
    "no-bitwise": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/prefer-literal-enum-member": "off",
    "@typescript-eslint/no-extraneous-class": "off",
  },

  ignorePatterns: ["dist", "**/*.cjs", "**/*.js", "**/*.mjs"],
};
