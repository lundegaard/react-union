<p align="center">
  <a href="https://react-union.org">
    <img alt="React Union" src="https://github.com/lundegaard/react-union/raw/master/logo.svg" width="300" />
  </a>
</p>

<p align="center">
  <a href="https://lundegaard.eu">
    <img alt="by Lundegaard" src="https://github.com/lundegaard/react-union/raw/master/by-lundegaard.png" width="120" />
  </a>
</p>

<h3 align="center">
🖍️ 🛡  🚀
</h3>

<h3 align="center">
Easy React integration into legacy systems 
</h3>

<p align="center">
The package provides React Unions's `.eslintrc.*` as an extensible shared config.
</p>

<p align="center">
<a href="https://react-union.org">See our documentation site.</a>
</p>

<p align="center">

<a href="https://travis-ci.org/lundegaard/react-union">
<img src="https://img.shields.io/travis/lundegaard/react-union/master.svg?style=flat-square" alt="Build status" />
</a>

<a href="https://greenkeeper.io/">
<img src="https://badges.greenkeeper.io/lundegaard/react-union.svg" alt="Greenkeeper badge" />
</a>

<a href="https://github.com/lundegaard/react-union">
<img src="https://flat.badgen.net/badge/-/github?icon=github&label" alt="Github" />
</a>

<img src="https://flat.badgen.net/badge/license/MIT/blue" alt="MIT License" />

<a href="https://www.npmjs.com/package/react-union">
<img src="https://flat.badgen.net/npm/dm/react-union" alt="Downloads" />
</a>

<a href="https://www.npmjs.com/package/react-union">
<img src=" https://flat.badgen.net/npm/v/react-union" alt="Version" />
</a>
</p>

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
