# React Union - Basic boilerplate

This project can either be used as the example of react-union and react-union-scripts working together or as the base of your project.

## Project structure

```
react-union-boilerplate
├── public 				- Contains templates for your application builds
|	└── SampleApp		- Folder stores static assets for application SampleApp
|		└── css			- Shared CSS
|			└── ...
|		└── fonts		- Shared fonts
|			└── ...
|		└── index.ejs 	- Template for the html-webpack-plugin
|		└── favicon.ico
├── src
|	├── apps			- Each nested folder defines different application build
|	|	└── SampleApp	- Folder for application SampleApp
|	|		└── fonts
|	|			└── ...
|	|		└── components
|	|			└── Root
|	|				└── Root.js
|	|				└── Root.scss - React Union scripts works with node-sass out of the box
|	|				└── index.js
|	|		└── index.js
|	|		└── routes.js
|	├── widgets
|	|	├── Content 	- Base folder for Content widget
|	|	|	└── components
|	|	|		└── ...
|	|	|	└── content.widget.js - Files with *.widget.js are loaded async when requested
|	|	|	└── route.js - Exports the React Union's route for the widget
|	|	└── Hero		- Base folder for Hero widget
|	|		└── components
|	|			└── ...
|	|		└── hero.widget.js
|	|		└── route.js
|	└──	test
|		└──	stubs
|			└──	scssStub.js - Stubs used for by Jest
├── .babelrc 			- Babel config for ES6+ syntax
├── .editorconfig
├── .eslintignore
├── .eslintrc.js 		- Extends eslint-config-react-union
├── .gitignore
├── jest.config.js 		- Jest's config for unit testing
├── package.json
├── README.md
└── union.config.js 	- React Union scripts confiration
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
