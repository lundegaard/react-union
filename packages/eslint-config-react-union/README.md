# eslint-config-react-union

The package provides React Unions's `.eslintrc.*` as an extensible shared config.

## Usage

There are two ESLint configurations for you to use.

### eslint-config-react-union

The default export contains all of our ESLint rules, including ECMAScript 6+ and React. It requires `eslint`, `babel-eslint`, `eslint-plugin-babel`, `eslint-plugin-import` and `eslint-plugin-react`.

### Installation

```sh
npm install eslint-config-react-union eslint@5.5.0 babel-eslint@10.0.0 eslint-plugin-babel@5.2.1 eslint-plugin-react@7.11.1 eslint-plugin-import@2.14.0 --save-dev
```
or

```sh
yarn add eslint-config-react-union eslint@5.5.0 babel-eslint@10.0.0 eslint-plugin-babel@5.2.1 eslint-plugin-react@7.11.1 eslint-plugin-import@2.14.0 -D
```

And add `"extends": "react-union"` to your .eslintrc.

### eslint-config-react-union/base

The eslint-config-react-union without excluding rules for React.

Add `"extends": "eslint-config-react-union/base"` to your `.eslintrc.*`.
