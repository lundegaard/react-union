# eslint-config-react-union

This package provides React Unions's .eslintrc as an extensible shared config.

## Usage

We export two ESLint configurations for your usage.

### eslint-config-react-union

Our default export contains all of our ESLint rules, including ECMAScript 6+ and React. It requires `eslint`, `babel-eslint`, `eslint-plugin-babel`, `eslint-plugin-import` and `eslint-plugin-react`.

1. Ensure packages are installed with correct version numbers by running:

```sh
npm install eslint-config-react-union eslint@4.7.2 babel-eslint@8.0.1 eslint-plugin-babel@4.1.2 eslint-plugin-react@7.4.0 eslint-plugin-import@2.7.0 --save-dev
```

or

```sh
yarn add eslint-config-react-union eslint@4.7.2 babel-eslint@8.0.1 eslint-plugin-babel@4.1.2 eslint-plugin-react@7.4.0 eslint-plugin-import@2.7.0 -D
```

2. Add `"extends": "union"` to your .eslintrc

### eslint-config-react-union/base
The eslint-config-react-union without excluding rules for React.

1. Add `"extends": "eslint-config-react-union/base"` to your .eslintrc
