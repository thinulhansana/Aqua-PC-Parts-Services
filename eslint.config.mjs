import firebaseRulesPlugin from "@firebase/eslint-plugin-security-rules";

const config = [
  {
    ignores: [
      "dist/**/*",
      ".next/**/*",
      ".open-next/**/*",
      "node_modules/**/*",
      "public/**/*",
    ],
  },
  firebaseRulesPlugin.configs["flat/recommended"],
];

export default config;
