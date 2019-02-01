# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- (_react-union_): `rescan()`, a function to imperatively rescan the document for widget descriptors. Callable from anywhere!
- (_babel-preset-react-union_): The preset is now configurable with options.

### Changed

- (_react-union-scripts_): Default value of `mangle` is now true (UglifyJS).
- (_react-union-scripts_): `devtools` related to source maps are now easier to customize.
- (_react-union-scripts_): The webpack entry is now an array instead of an object. As a result, the output is now named `main` instead of `<app-name>`. If you're using React Union with Liferay, see the updated AMD Loader Scripts.

## [0.11.0] – 2018-12-06

Many changes for future SSR support!

### Added

- (_react-union_): Handling of invalid JSON in widget and common descriptors.
- (_babel-preset-react-union_): The `babel-plugin-universal-import` has been added for convenience. 

### Changed

- (_react-union_): Routes should now have the `component` property instead of `getComponent`. Please use `react-universal-component` or some other solution for asynchronous loading of React components.
- (_react-union_): `onScanEnd` now returns an object with a `widgetConfigs` property (instead of `configs`).
- (_react-union_): `justUnmountComponentAtNode` no longer accepts the `reactElement` as the first argument for consistency.

### Fixed

- (_react-union_): The rollup config has been improved.
- (_react-union-scripts_): Webpack optimization is now properly utilized, resulting in smaller bundle sizes.

### Removed

- (_react-union_): `<Union />` no longer accepts the `strictMode` prop.
- (_react-union-scripts_): `union.config.js` no longer supports the `generateVendorBundle` and `vendorBlacklist` props.
