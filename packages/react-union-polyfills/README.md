# React union polyfills
Fork of [react-app-polyfill](https://github.com/facebook/create-react-app/).

Library, that imports polyfills instead of deprecated @babel/polyfills

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
