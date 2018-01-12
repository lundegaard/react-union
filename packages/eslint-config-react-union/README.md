# eslint-config-react-union

The package provides React Unions's .eslintrc as an extensible shared config.

## Usage

We export two ESLint configurations for your usage.

### eslint-config-react-union

Our default export contains all of our ESLint rules, including ECMAScript 6+ and React. It requires `eslint`, `babel-eslint`, `eslint-plugin-babel`, `eslint-plugin-import` and `eslint-plugin-react`.

### Installation

```sh
npm install eslint-config-react-union eslint@4.7.2 babel-eslint@8.0.1 eslint-plugin-babel@4.1.2 eslint-plugin-react@7.4.0 eslint-plugin-import@2.7.0 --save-dev
```

or

```sh
yarn add eslint-config-react-union eslint@4.7.2 babel-eslint@8.0.1 eslint-plugin-babel@4.1.2 eslint-plugin-react@7.4.0 eslint-plugin-import@2.7.0 -D
```

And add `"extends": "union"` to your .eslintrc.

### eslint-config-react-union/base
The eslint-config-react-union without excluding rules for React.

Add `"extends": "eslint-config-react-union/base"` to your .eslintrc
