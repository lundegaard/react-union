**Work-in-progress**

# API reference

## Content

* [Usage](#usage)
* [Components](#components)
* [Widget descriptor](#widget-descriptor)
* [Route](#route)
* [Utilities](#utilities)

## Usage

First, we will assume that code below is a part of your server output.

```html
<main>
	<p>Static content produced by your favourite CMS.</p>


	<div id="hero-container"></div>


	<p>More static content produced by your favourite CMS.</p>

	<!-- Union widget descriptor - configuration for your React widget  -->
	<script data-union-widget="hero" data-union-container="hero-container" type="application/json">
		{
			"username": "reactlover"
		}
	</script>
</main>
```

As you can see above, there is an empty `div` with an `id` of `hero-container`. This is the HTML element where we want to render the widget called `hero`.
To do so, we must create a _widget descriptor_.

A _Widget descriptor_ is a JSON script element that contains the `data-union-widget` attribute. It tells React-union that the `hero` widget should be rendered into the `hero-container` element and be passed the data `{"username": "reactlover"}`.

Great! Now we will write some code for the widget, namely the component `Hero.js`. The widget must always consist of a single React component.

```jsx
// Hero.js

// Main component of your Hero widget
const Hero = ({ data }) => `Hello, ${data.username}!`;

export default Hero;
```

The widget simply renders the `username` passed in the widget descriptor content.

Next, React-union needs to know where is the code for the widget we marked as `hero`.
So we will write simple object called `route` (in our case `HeroRoute`):

```js
// HeroRoute.js
import Hero from './Hero';

export default {
	path: 'hero',
	getComponent(done) {
		done(Hero);
	},
};
```

A route contains just two properties.
This one says that if there is a widget descriptor in the DOM with the name `hero`,
we return its root React component passed as the argument of the callback `done` inside `getComponent`.

_NOTE_: To make things simple, we are using a static import of `Hero` component. You can also use dynamic importing (e.g. `require.ensure`, the webpack `import` function, `react-loadable` or anything else).
_NOTE_: If you know React-router, the route format should be familiar to you.

Finally, we can define our component responsible for rendering widgets based on the provided routes and *widget descriptor*s.

```jsx
// Root.js
import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const Root = ({ store }) => <Union routes={[HeroRoute]} />;

export default Root;
```

Just render the Union component with an array of supported routes. In our case it is just `HeroRoute`.

When `<Union />` is mounted, the `scan` process of HTML starts.

The scan process finds the widget descriptors in the DOM and, based on them, `<Union />` renders the appropriate widgets.

The scan is launched if either `Union` is mounted or reference to routes changes.

In the case above, a new array of routes is created with every render and it impacts the performance.
If there is no need for generating routes dynamically, we can refactor above example like this:

```jsx
// Root.js

import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const routes = [HeroRoute];

const Root = ({ store }) => <Union routes={routes} />;

export default Root;
```

_NOTE_: We have chosen to define the routes alongside the widgets. Should you need multiple entry points to your application (or even reuse an existing widget in multiple paths), it might make more sense to define the routes in the entry point (the app) itself - the choice is yours!

## Components

### `<Union />`

Renders your widgets based on provided _routes_ and the _widget descriptors_ in the DOM. The widgets are managed in a single virtual DOM even though their markup might distributed over the DOM.

#### Properties

* [`children`]\(_React node_) - Children of the `Union` component.
* [`onScanEnd`]\(_function_) - Called after the scan of the HTML is done.
* [`onScanError`]\(_function_) - Called when there is an error while scanning the HTML.
* [`onScanStart`]\(_function_) - Called before the scan of the HTML.
* [`parent`]\(_DOM element_) - Element in which the scan is running. The default value is `document.body`.
* [`routes`]\(_array of Route_) - Array of routes that are supported by your application. See section _Route_.
* [`strictMode`]\(_boolean_) - Enable React.Strict mode. By default `true`.

## Widget descriptor

_Widget descriptor_ is a DOM element used for the description of:

* where to place the widget in the HTML,
* what widget should be rendered in the container (Based on _route_)
* passing some data from a server to the widget

The widget descriptor must be a `<script>` element with the attribute `data-union-widget`. This element can also contain additional attributes.

### Attributes

* [`data-union-widget`]\(_string_) `required` - Name of the widget. In order to pair a _widget descriptor_ with a route, this attribute must equal to a `path` property of a route.
* [`data-union-container`]\(_string_) - `id` attribute of an HTML element in which the widget returned by route will be rendered. `container` should be unique within the scope of a _widget descriptor_.
* [`data-union-namespace`]\(_string_) - String that represents a unique ID of a _widget descriptor_. By default, the value of `namespace` is set to value within `container`.

_NOTE:_ At least one of the `data-union-container` or `data-union-namespace` attributes must be specified.

Additionally, you may pass any valid JSON as the content of the script element, which will be available in the widget root component under the `data` prop.

### Examples

**Simple**

It renders the widget returned by the route with the path `my-widget` to element with id `my-widget-root`.

```html
<div id="my-widget-root"></div>

<!-- Widget descriptor -->
<script data-union-widget="name"
				data-union-container="my-widget-root"
				type="application/json">
</script>
```

**With `namespace`**

It renders the widget returned by the route with the path `my-widget` to the element with id `my-widget-root`. The instance is used internally under the key `unique-string` (provided by `namespace`).

```html
<div id="my-widget-root"></div>

<!-- Widget descriptor -->
<script data-union-widget="my-widget"
				data-union-container="my-widget-root"
				data-union-namespace="unique-string"
				type="application/json">
</script>
```

**Passing data**

If you need to provide custom data to the instance of your widget, pass a valid JSON as the content of the script element.

```html
<div id="my-widget-root"></div>

<!-- Widget descriptor -->
<script data-union-widget="my-widget" data-union-container="my-widget-root" type="application/json">
	{
		"customField": "custom field",
		"urls": {
			"home": "www.example.com",
			"api": "/api"
		}
	}
</script>
```

**Passing common data to all widgets**

If you need to provide common data to all widgets in your application, use the `data-union-common` attribute. This data will be recursively merged with the JSON content of each widget descriptor.

```html
<!-- Widget descriptor -->
<script data-union-common type="application/json">
	{
		"customField": "custom field",
		"urls": {
			"home": "www.example.com",
			"api": "/api"
		}
	}
</script>
```

_NOTE:_ You can provide multiple common data descriptors to React-union, but it is discouraged if you don't have control over their order in the portal or CMS.

This data will also be available under the `rawCommonData` property in `WidgetContext` as well as the `props` passed to the widget. Note that you should try to use `data` instead of `rawCommonData` as much as possible to allow for widget-specific overriding. The `rawCommonData` prop is made available for convenient application-wide configuration which depends on this data, such as HTTP headers for Redux-based AJAX.

## Route

An object that is used for pairing a widget descriptor with a React widget.

### Properties:

* [`path`]\(_string_) - Indicates that a _widget descriptor_ with the `data-union-widget` attribute equal to this value is matched by this route.
* [`getComponent(done: function): undefined`]\(_function_) This function gets called after the `<Union />` component finishes scanning the DOM. You will be provided a single argument - `done`. You should call this callback with the main React component of the matching widget:

```js
// routeForMyWidget.js

export default {
	name: 'my-widget',
	getComponent(done) {
		import('./MyWidget').then(MyWidget => done(MyWidget.default));
	},
};
```

_NOTE_: In the example above, we use the webpack `import` function. However, if you use React-union-scripts, there is a better way to load your components asynchronously. See `react-union-boilerplate-basic`.

## Utilities

### `justRender`

[`justRender(component: ReactComponent, htmlElementId: String)`]

A wrapper over `ReactDOM.render`. You need to provide the component you want to render.

* [`component`] - required - Root component of your app.
* [`htmlElementId`] - `id` of the HTML element where the `component` should be rendered. If the element is not found, `justRender` will create it for you, defaulting to `"union"`.

### `justUnmountComponentAtNode`

[`justUnmountComponentAtNode(component: ReactComponent, htmlElementId: String)`]

Wrapper over `ReactDOM.unmountComponentAtNode`. You need to provide component that you want to unmount.

* [`component`] - required - Root component of your app.
* [`htmlElementId`] - `id` of the HTML element where `component` should be unmounted. Defaults to `"union"`.
