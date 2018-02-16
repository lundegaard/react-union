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


	<p>Another static content produced by your favourite CMS.</p>

	<!-- Union widget descriptor - configuration for your React widget  -->
	<script data-union-widget="hero" data-union-container="hero-container" type="application/json">
		{"username": "reactlover"}
	</script>
</main>
```

As you can see above, there is empty `div` with `id` `hero-container`. This is the HTML element where we want to render widget called `hero`.
To do so we must create the _widget descriptor_.

A _Widget descriptor_ is a JSON script element that contains the `data-union-widget` attribute. It tells React-union that if there is a widget called `hero` then it should be rendered into `hero-container` and pass it the data `{"username": "reactlover"}`.

Next, we will write code for the widget `Hero.js`. The widget must always be a React component.

```js
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

_NOTE_: For simplicity, we are using static import of `Hero` component. But you can also use dynamic import (e. g. by `require.ensure`).
_NOTE_: If you know React-router, the route format should be familiar to you.

Finally, we can define our component responsible for rendering your widgets based on the provided routes and *widget descriptor*s.

```js
// Root.js

import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const Root = ({ store }) => <Union routes={[HeroRoute]} />;

export default Root;
```

We just use Union component and pass it an array of supported routes. In our case just `HeroRoute`.

When `<Union />` is mounted the `scan` process of HTML starts.

The scan process finds the widget descriptors in the DOM and, based on them, `<Union />` renders appropriate Widgets.
The scan is launched if either `Union` is mounted or reference to routes changes.

So in the case above, the array of routes is made with every render and it impacts the performance.
If there is no need for generating routes dynamically we can refactor above example to:

```js
// Root.js

import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const routes = [HeroRoute];

const Root = ({ store }) => <Union routes={routes} />;

export default Root;
```

## Components

### `<Union />`

Renders your widgets according to found _widget descriptors_ and passed _routes_. Widgets are encapsulated in one virtual DOM even though widgets are distributed over the HTML in different parts.

#### Properties

* [`children`]\(_React node_) - Children of the `Union` component
* [`onScanEnd`]\(_func_) - Called after the scan of the HTML is done
* [`onScanError`]\(_func_) - Called when there is an error while scanning the HTML
* [`onScanStart`]\(_func_) - Called before the scan of the HTML
* [`parent`]\(_DOM element_) - Element in which the scan is running. By default `document.body`.
* [`routes`]\(_array of Route_) - Array of routes that are supported by your application. See section _Route_.

## Widget descriptor

_Widget descriptor_ is a DOM element used for description of:

* where to place the widget in the HTML,
* what widget should be rendered in the container (Based on _route_)
* passing some data from a server to the widget

First, there must be the `<script>` element with data attribute `data-union-widget`. This element can also contain additional attributes.

### Attributes

* [`data-union-widget`]\(_string_) `required` - Name of widget that is used to pair the route with the widget descriptor. `path` of the route must equal to the `name` of the widget descriptor to be correctly paired.
* [`data-union-container`]\(_string_) - `id` attribute of HTML element in which the widget returned by route will be rendered. `container` should be unique within the scope of a widget descriptor.
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

**Data Widget**

If you only need to provide data to other widgets in your application, there is no need to render anything.

```html
<!-- Widget descriptor -->
<script data-union-widget="my-widget" data-union-namespace="my-widget-namespace" type="application/json">{
	{
		"customField": "custom field",
		"urls": {
			"home": "www.example.com",
			"api": "/api"
		}
	}
</script>
```

## Route

The object that is used for pairing a widget descriptor with a widget.

### Properties:

* [`path`]\(_string_) if there is a _widget descriptor_ with `name` that equals to `path` then the route is used
* [`getComponent(done: function): undefined`]\(_function_) If `path` and `name` are matching, then the `getComponent` is called after `<Union />` finishes scan of the DOM.
  `getComponent` has one argument `done`. You should call it after loading of your widget is done. You must pass the main React component of your widget as the argument of the `done`:

```js
// routeForMyWidget.js

export default {
	name: 'my-widget',
	getComponent(done) {
		require.ensure('./MyWidget').then(MyWidget => done(MyWidget));
	},
};
```

**note:** In the example above we use `require.ensure`. However, if you use React-union-scripts there is a better way to async load your components. See `react-union-boilerplate-basic`.

## Utilities

### `justRender`

[`justRender(component: ReactComponent, htmlElementId: String)`] Wrapper over `ReactDOM.render`. You just need to provide component that you want to render. - [`component`] - required - Root component of your app, - [`htmlElementId`] - Id of HTML element where `component` should be rendered. If element is not found, `justRender` will create it, defaulting to `"union"`.

### `justUnmountComponentAtNode`

[`justUnmountComponentAtNode(component: ReactComponent, htmlElementId:String)`] Wrapper over `ReactDOM.unmountComponentAtNode`. You just need to provide component that you want to unmount. - [`component`] - required - Root component of your app, - [`htmlElementId`] - Id of HTML element where `component` should be unmounted. Defaults to `"union"`.
