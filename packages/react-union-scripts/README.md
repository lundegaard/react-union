**Work-in-progress**

# React-union-scripts

Extendable and configurable set of scripts for building and running your React applications that is designed for not a typical Node environments such as Content Management Systems (CMS) or Java Portals.

## Main features

* **simple to use** - just add the dependency to your `package.json` and roll
* **use multiple entry points in one project** - useful for theming or for splitting your code to optimize bundle size
* **designed for large codebase** - multiple entry points, splitting code, async loading of JavaScript modules

## Installation

```sh
yarn add react-union-scripts --dev
```

or

```sh
npm install --save-dev react-union-scripts
```

## Usage

**TL;DR** You can use one of our [examples](https://github.com/lundegaard/react-union/tree/master/packages/react-union-boilerplate-basic) as a boilerplate for your project instead.

1. Simulate output of your server in development

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

For details how to write a template, see [https://github.com/jantimon/html-webpack-plugin](html-webpack-plugin).

2. To your `package.json` add scripts:

```json
{
	"start": "react-union-scripts start --app YourAppName",
	"build": "react-union-scripts build"
}
```

3. Create `<project root>/src/apps/YourAppName/index.js`:

```js
console.log('Hello world!');
```

4. Run your project

**Development server**

```
yarn start --app YourAppName
```

**Start proxy server**

```
yarn start --app YourAppName --proxy
```

**Production build**

Build all registered apps.

```
yarn build --release
```

or build just one

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
yarn start --app YourAppName --analyze
```

## CLI

### `analyze`
- available for: `start`

Runs [`webpack-bundle-analyzer`](https://github.com/th0r/webpack-bundle-analyzer).

Example:

```
react-union-scripts start --app MyApp --analyze
```

### `app`
- available for: `start`, `build`

Determines what application to build or start.

Example:

```
react-union-scripts start --app MyApp
```

### `no-hmr`
- available for: `start`, `build`

If is set, hot module replacement is off.

Example:

```
react-union-scripts start --no-hmr
```

### `proxy`
- available for: `start`.

If is set, we start proxy server instead of development server.

Example:

```
react-union-scripts start --proxy
```


### `release`
- available for: `start`, `build`

If is set, the build is optimized for production.

Example:

```
react-union-scripts build --release
```

### `target`
- available for: `start`, `build`

Custom value that can be used in `union.config.js`.

Example:

```
react-union-scripts build --target wordpress
```

### `verbose`
- available for: `start`, `build`

If is set, the console output is more verbose.

Example:

```
react-union-scripts build --verbose
```


## `union.config.js`

Place the file into the root of your project if you want to configure react-union-scripts.

Configuration file can eiher exports:
- static JSON object or
- function.

To the function is passed object that describes flags derived from calling our CLI api:

```js
// example of dynamic union.config.js
module.exports = ({
	target, // custom value
	script, // build, start or test
	app,
	debug,
	proxy,
	verbose,
	noHmr,
	analyze,
}) => ({
	outputMapper: target === 'liferay' ? { js: 'widgets/js' } : {},
});
```

Resulting configuration can redefine following properties.

### `devServer`

[`devServer.port`]\(number): port of proxy server

### `proxy`

[`proxy.port`]\(number): port of proxy server

[`proxy.target`]\(string): target of proxy

[`proxy.publicPath`]\(string): Public path of the application. See [webpack](https://github.com/webpack/docs/wiki/configuration#outputpublicpath). Required if you want to run proxy.

### `outputMapper`

Output mapper makes possible further customization of the folder structure that is produced by the build. All paths are relative to the `apps[].paths.build` directory.

[`outputMapper.js`]\(string): Path of JavaScript assets. Defaults to `static/js`.
[`outputMapper.media`]\(string): Path of media assets. Defaults to `static/media`.

### `apps`

Array of configurations for your applications. Every configuration is merged with above properties. You can rewrite them separately for every application.

For example in the config:

```js
module.exports = {
	proxy: { port: 3333 },
	apps: [
		{
			name: 'MyFirstApp',
			proxy: { port: 5000 },
		},
		{ name: 'MySecondApp' },
	],
};
```

MyFirstApp will use proxy port `5000` and MySecondApp will use common value `3333`.

[`apps[].name`]\(string): Name of your application that is used for both:
- finding HTML template in `./public` directory and
- naming your bundle file.
Required.

[`apps[].paths.build`]\(string) Path to the build directory. Defaults to `<project root>/build/[ApplicationName]`.

[`apps[].paths.public`]\(string) Path to public directory. Directory should contain:
- static assets, that will be copied to the build directory
- a HTML template that is named according to `templateFilename` property.
Defaults to `<project root>/public/[ApplicationName]`.

[`apps[].paths.index`]\(string) Path to entry file of a the application. Defaults to `<project root>/apps/[ApplicationName]`.

### `templateFilename`

[`templateFilename`]\(string): Name of the HTML template. Defaults to `index.ejs`.

### `generateVendorBundle`

[`generateVendorBundle`]\(boolean) If true, generates separate vendor chunk. Vendors are all dependencies from your `package.json`. Defaults to `true`.

### `vendorBlackList`

['vendorBlackList']\(array[string]) List of depenedencies that should not be included within vendor chunk. Defaults to `[]`.

## Recipes

### `.ejs` templates for mocking the server output

Create your .ejs template at `/public/<YourAppName>/index.ejs`.
`YourAppName` refers to application registered within `union.config.js`.

### Asynchronous loading of modules

If there is a file with suffix ".widget.js" it is loaded by [bundle-loader](https://github.com/webpack-contrib/bundle-loader). Bundle-loader is better alternative to both [`require.ensure`](https://webpack.github.io/docs/code-splitting.html) and [`import()`];
Every async module is splitted up into individual chunks.

**Example**

```jsx
// MyWidget.widget.js

const MyWidget = props => {
	// Your React component
};

export default MyWidget;
```

```js
// MyWidgetRoute.js

import loadMyWidget from './MyWidget.widget';

export default {
	path: 'my-widget',
	getComponent(done) {
		loadWidget(mod => done(mod.default));
	},
};
```
