module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "storefront",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "prettier", // prettier *has* to be the last one, to avoid conflicting rules
  ],

  // @todo: get rid of most of it
  ignorePatterns: ["saleor/api.tsx", "pnpm-lock.yaml", "graphql.schema.json", "lib/$path.ts"],
  plugins: ["simple-import-sort", "formatjs", "@typescript-eslint"],
  rules: {
    quotes: ["error", "double"],
    "react/react-in-jsx-scope": "off", // next does not require react imports
    "import/extensions": "off", // file extension not required when importing
    "import/no-unresolved": "off", // doesn't work with monorepo, see https://github.com/import-js/eslint-import-resolver-typescript
    "react/jsx-filename-extension": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "no-await-in-loop": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "import/first": "warn",
    "import/newline-after-import": "warn",
    "import/no-duplicates": "warn",
    "formatjs/no-offset": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/ban-types": "off",
    "no-console": [
      "error",
      {
        allow: ["warn", "error", "debug"],
      },
    ],
    "no-continue": "off",
    "operator-linebreak": "off",
    "max-len": "off",
    "array-callback-return": "off",
    "implicit-arrow-linebreak": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-restricted-imports": "off",
    "no-restricted-exports": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    // TO FIX:
    "import/no-cycle": "off", // pathpidia issue
    "import/prefer-default-export": "off",
  },
};
