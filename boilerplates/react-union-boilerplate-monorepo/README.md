# React Union - Basic boilerplate for Monorepo

This project can either be used as the example of react-union and react-union-scripts working together or as the base of your project.


## Project structure

```
react-union-boilerplate-monorepo
├── packages 			- Yarn workspaces packages
|   ├── union-app-sample-app
|   |   ├── package.json
|	|   └── public		- Folder stores static assets for application union-app-sample-app
|	|   |   └── css			- Shared CSS
|	|   |	    └── ...
|	|   |   └── fonts		- Shared fonts
|	|   |	    └── ...
|	|   |   └── index.ejs 	- Template for the html-webpack-plugin
|	|   |   └── favicon.ico
|   |	└── src
|	|		└── components
|	|		|	└── Root
|	|		|		└── Root.js
|	|		|		└── Root.scss - React Union scripts works with node-sass out of the box
|	|		|		└── index.js
|	|		└── index.js
|	|		└── routes.js
|   ├── union-widget-content
|   |   ├── package.json
|   |   └── src
|	|		└── components
|	|			└── ...
|	|		└── content.widget.js - Files with *.widget.js are loaded async when requested
|   └── union-widget-hero
|       ├── package.json
|       └── src
|			└── components
|				└── ...
|			└── content.widget.js
├── .babelrc 			- Babel config for ES6+ syntax
├── .editorconfig
├── .eslintignore
├── .eslintrc.js 		- Extends eslint-config-react-union
├── .gitignore
├── package.json
├── README.md 
└── testsSetup.js 		- Adapters for enzyem
```

## Running the example

```sh
git clone https://github.com/lundegaard/react-union.git

cd react-union/boilerplates/react-union-boilerplate-basic

yarn && yarn start
```

Make sure you have Yarn v1.3.1 or higher and Node v8 or higher.

## Using the Boilerplate

### Starting develop server

```sh
yarn start
```

### Starting proxy

```sh
yarn start --proxy
```

### Production build

```sh
yarn build --release
```

**Note:** Creates production bundles.

### Running unit tests in watch mode

```sh
yarn test
```

### Analyze build

```sh
yarn build --release --analyze
```
