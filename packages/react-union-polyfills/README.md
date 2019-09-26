# React union polyfills

Library, that imports polyfills instead of deprecated @babel/polyfills

##Usage

Just import package in react-union root package

#### `import { importPolyfills } from 'react-union-polyfills';`

###Internet Explorer

If you need to support Internet Explorer 11, call `importPolyfills.ie11();` in ready function.

If you need to support Internet Explorer 9, call `importPolyfills.ie9();`, ie11 is called automatically.
