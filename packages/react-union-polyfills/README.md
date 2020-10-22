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
Library, that imports polyfills instead of deprecated @babel/polyfills
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

Fork of [react-app-polyfill](https://github.com/facebook/create-react-app/).


## Usage

Import it as the first line in your application code.

```js
import 'react-union-polyfills';
```

### Internet Explorer

If you need to support older versions of Internet Explorer, call:

```js
// for IE 11:
import 'react-union-polyfills/ie11';
import 'react-union-polyfills';


// for IE 9:
import 'react-union-polyfills/ie9';
import 'react-union-polyfills';
```
