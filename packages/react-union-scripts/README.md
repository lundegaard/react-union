**Work-in-progress**

# React-union-scripts

Extendable and configurable set of scripts for building and running your React applications that are designed for not a typical Node environments such as Content Management Systems (CMS) or Java Portals.

## Main features

* **simple to use** - just add the dependency to your `package.json` and roll
* **use multiple entry points in one project** - useful for theming or for splitting your code to optimize bundle size
* **designed for large codebase** - multiple entry points, splitting a code, async loading of JavaScript modules

## Installation

```sh
yarn add react-union-scripts --dev
```

or

```sh
npm install --save-dev react-union-scripts
```

## Usage

**TL;DR;** You can use one of our [examples](https://github.com/lundegaard/react-union/tree/master/packages/react-union-boilerplate-basic) as a boilerplate for your project instead.

1. Create `union.config.js` in root of your project

```js
const path = require('path');

module.exports = {
	devServer: {
		port: 3300,
		baseDir: path.resolve(__dirname, './build/public'),
	},
	apps: [
		{
			name: 'YourAppName',
			path: path.resolve(__dirname, './src/apps/YourAppName')
		},
	],
};

```

2. Simulate output of your server in development

Create `<project root>/public/YourAppName/index.ejs`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

For details, how to write a template, see [https://github.com/jantimon/html-webpack-plugin](html-webpack-plugin).

3. To your `package.json` add scripts:

```json
{
	"start": "union-scripts start --app YourAppName",
	"build": "union-scripts build"
}
```

4. Run your project

**Development server**

```
yarn start --app YourAppName
```

**Start proxy server**

```
yarn start --app --proxy YourAppName
```

**Production build**

Build all of registered apps.

```
yarn build --release
```

or build one

```
yarn build --app YourAppName --release
```

**Running Jest tests**

Run in watch mode

```
yarn test
```

or run just once

```
yarn test --release
```


**Analyze build**

Runs [`webpack-bundle-analyzer`](https://github.com/th0r/webpack-bundle-analyzer).

```
yarn build --app YourAppName --analyze
```



## `union.config.js`
File exports objects with following properties.

### `buildDir`

['buildDir']\(string) Path to build directory. Defaults to `<project root>/build/public`.

### `generateVendorBundle`

[`generateVendorBundle`]\(boolean) If true, generates separate vendor chunk. Vendors are all dependencies from your `package.json`. Defaults to `true`.

### `vendorBlackList`

['vendorBlackList']\(array[string]) List of depenedencies that should not be included withing vendor chunk. Defaults to `[]`.

### `proxy`
[`proxy.port`]\(number): port of proxy server

[`proxy.target`]\(string): target of proxy

[`proxy.publicPath`]\(string): Public path of the application. See [webpack](https://github.com/webpack/docs/wiki/configuration#outputpublicpath). Required if you want to run proxy.

### `devServer`

[`devServer.port`]\(number): port of proxy server

[`devServer.baseDir`]\(string): baseDir for server. Defaults to `buildDir`

### `apps`
Array of configurations for your applications. Every configuration is merged with above properties. You can rewrite them separately for every application.

For example:

```
module.exports = {
	proxy: {
		port:3333,
	},
	apps: [
		{
			name: 'MyApp',
			path: path.resolve(__dirname, './src/apps/MyApp'),
			proxy: {
				port: 3330,
			},
		},
		{
			name: 'MySecondApp',
			path: path.resolve(__dirname, './src/apps/MySecondApp')
		},
	],
}

```

MyApp uses port `3330` for proxy and MySecondApp uses `3333`.

[`apps[].name`]\(string): Name of your application. It is used for both finding HTML template in `./public` directory and naming your bundle file. Required.
[`apps[].path`]\(string): Path to entry file of a application. Required.

## Recipes

### `.ejs` templates for mocking the server output

Create your .ejs template at `/public/<YourAppName>/index.ejs`.
`YourAppName` refers to application registered within `union.config.js`.

### Asynchronous loading of modules

If there is a file with suffix ".widget.js" than that module is loaded by [bundle-loader](https://github.com/webpack-contrib/bundle-loader). Bundle-loader is the better alternative to both [`require.ensure`](https://webpack.github.io/docs/code-splitting.html) and [`import()`];
Every async module is splitted into individual chunk.

**Example**

```
// MyWidget.widget.js

const MyWidget = (props) => {
	// Your React component
}

export default MyWidget;
```

```
// MyWidgetRoute.js

import loadMyWidget from './MyWidget.widget';

export default {
	path: 'my-widget',
	getComponent(done) {
		loadWidget((module) => done(module.default));
	}
};
```
