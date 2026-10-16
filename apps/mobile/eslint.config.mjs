import expoConfig from "eslint-config-expo/flat.js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...expoConfig,
  {
    rules: {
      // Disable this rule for initialization patterns - it's a common and acceptable pattern
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
