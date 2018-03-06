# React Union - Wordpress boilerplate

This project is an example of React-Union and React-Union-Scripts working together with CMS Wordpress. User can set up their own theme with instructions below or use [pre-prepared example](https://github.com/foxyq/react-union-wordpress.git) of Twentyseventeen theme.

## Project structure

```
react-union-boilerplate
├── public 				- Contains templates for your application builds
|	└── SampleApp		- Folder for application SampleApp
|		└── index.ejs 	- Template for the html-webpack-plugin
├── src
|	├── apps			- Each nested folder defines different application build
|	|	└── SampleApp	- Folder for application SampleApp
|	|		└── fonts
|	|			└── ...
|	|		└── scss
|	|			└── front.scss - React Union scripts works with node-sass out of the box
|	|		└── index.js
|	|		└── Root.js
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

## Setting up the example

```sh
git clone https://github.com/lundegaard/react-union.git

cd react-union/boilerplates/react-union-boilerplate-wordpress

yarn
```

Make sure you have Yarn v1.3.1 or higher and Node v8 or higher.

Open file `react-union-boilerplate-wordpress/union.config.js` and change proxy settings (port, path) to match with your running Wordpress instance. Public path is a place where your build scripts will be expected.

```sh
    proxy: {
        publicPath: '/wpunion/wp-content/themes/twentyseventeen/assets/js/',
        target: 'http://localhost:80/wpunion',
	},
```

Build your app

```sh
    yarn build --proxy --release
```

Copy built files from `react-union-boilerplate-wordpress/build/public/assets/SampleApp/` to your Wordpress installation `wp-content/themes/ACTIVE_THEME_NAME/assets/js`. This path should match with the public path we set in `union.config.js`

Update Wordpress file `functions.php` in your active theme directory to load React-Union scripts (in this case we put it to the end of `function twentyseventeen_scripts()` )

```sh
   wp_enqueue_script( 'react-union-vendor', get_theme_file_uri( '/assets/js/vendor.bundle.js' ), null , '1.0.0', true );
   wp_enqueue_script( 'react-union-sample-app', get_theme_file_uri( '/assets/js/SampleApp.bundle.js' ), null , 		'1.0.0', true );
```

Place Union DOM-marks where you want to display your React-Union widget (be careful to use unique IDs, that were not used already). We used `template-parts/post/content.php` in our example. Wordpress loads bundled React-Union scripts which will automatically look for DOM-marks in document and then load and display appropriate components.

```sh
	<div class="react-widget">
		React-union widget
		<div id="hero"></div>
		<script data-union-widget="" type="application/json">
		{
			"name": "hero",
			"container": "hero"
		}
		</script>

		<div id="react-content"></div>
		<script data-union-widget="" type="application/json">
		{
			"name": "content",
			"container": "react-content"
		}
		</script>
	</div>
```

Finally, run your Wordpress instance and you should see React-Union in action.

## Using the Boilerplate

### Starting proxy

```sh
yarn start --proxy
```

### Production build

```sh
yarn build --release --proxy
```

**Note:** Runs test, lint and then builds with Webpack.

### Running unit tests in watch mode

```sh
yarn test
```

### Analyze build

```sh
yarn build --release --analyze
```
