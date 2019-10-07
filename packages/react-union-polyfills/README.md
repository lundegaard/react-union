# React union polyfills

Library, that imports polyfills instead of deprecated @babel/polyfills

## Usage

Just import package in react-union root package

```js
import { importPolyfills } from 'react-union-polyfills';
```

### Internet Explorer

If you need to support older versions of Internet Explorer, call:

```js
// for IE 11:
importPolyfills.ie11();

// for IE 10:
importPolyfills.ie9();
```
