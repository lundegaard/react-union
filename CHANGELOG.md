# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

- (_react-union-liferay-build-tools_) - [Fix](https://github.com/lundegaard/react-union/pull/478) of missing `template-npmbundlerrc.json` in packaging

## [0.16.0] – 2020-03-26
- [New liferay boilerplate](https://github.com/lundegaard/react-union/pull/477)
- [Progress on react-union-liferay-build-tools](https://github.com/lundegaard/react-union/pull/477)
- [fix](https://github.com/lundegaard/react-union/pull/477) of multiple warnings being thrown in dev console due to https://github.com/liferay/liferay-amd-loader/commit/30b6e56fb3464e0a68b1f0e2601314f308184edb#diff-5d3acecd98578daf8479f9970d40a347

## [0.15.3] – 2020-02-26
- [Fixing prop-type for routeShape](https://github.com/lundegaard/react-union/pull/468)

## [0.15.2] – 2019-12-12
- [Updating dependencies](https://github.com/lundegaard/react-union/pull/461)

## [0.15.1] – 2019-12-12
- [Updating dependencies](https://github.com/lundegaard/react-union/pull/458)

## [0.15.0]
- (_eslint-config-react-union_) - [Adding new eslint rules](https://github.com/lundegaard/react-union/issues/445) - `arrow-body-style` and `curly`

## [0.14.2] – 2019-10-07

### Changed
- [Adding `universal` options to babel preset](https://github.com/lundegaard/react-union/issues/324)

## [0.14.1] – 2019-10-07

### Changed

- [Updating dependencies](https://github.com/lundegaard/react-union/pull/439)

## [0.14.0] – 2019-09-30	

### Changed
- [Removing @babel/polyfill](https://github.com/lundegaard/react-union/issues/424)
- [Updated Liferay boilerplates to work with Liferay 7.2](https://github.com/lundegaard/react-union/pull/430)
  
## [0.13.1] – 2019-09-26	

### Changed
- (_react-union-scripts_) - [Migrating to terser](https://github.com/lundegaard/react-union/pull/427) 

## [0.13.0] – 2019-09-25	

### Fixed
- (_react-union-scripts_) - [Liferay basic example fails on yarn build](https://github.com/lundegaard/react-union/issues/412) 

## [0.12.1] – 2019-03-12

### Changed
- Added `^` to all dependencies in `package.json`.

## [0.12.0] – 2019-02-06

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
