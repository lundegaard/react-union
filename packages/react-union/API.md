**Work-in-progress**

# API reference

## Content

* [Usage](#usage)
* [Components](#components)
* [DOM-mark](#dom-mark)
* [Route](#route)
* [Utilities](#utilities)

## Usage

Firstly we will assume that code below is part of your server output.

```html
<main>
	<p>Static content produced by your favourite CMS.</p>


	<div id="hero-container"></div>


	<p>Another static content produced by your favourite CMS.</p>

	<!-- Union DOM-mark - configuration for your React widget  -->
	<script data-union-widget="" type="application/json">
	{
		"name": "hero",
		"container": "hero-container",
		"data": {"username": "reactlover"}
	}
	</script>
</main>
```

As you can see above, output within the static content there is the empty `div` with `id` `hero-container`. This is the HTML element where we want to render widget called `hero`.
To do so we must create the *DOM-mark*.

DOM-mark is the JSON that is placed inside the `<script>` tag that contains `data-union-widget` attribute. The mark above tells to React-union that if there is a widget called `hero` then it should be rendered into `hero-container` and pass him the data `{"username": "reactlover"}`.

Next, we will write the code for widget `Hero.js`. The widget must be always a React component.

```js
// Hero.js

// Main component of your Hero widget
const Hero = ({ data }) => `Hello, ${data.username}!`;

export default Hero;
```

The widget simply renders the `username` passed through the DOM mark.

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

The route contains just two properties.
We say if there is the DOM-mark with name `hero`,
than return React component passed as the argument of the callback `done` inside `getComponent`.

*NOTE*: For simplicity, we are using static import of `Hero` component. But you can use dynamic import (e. g. by `require.ensure`).
*NOTE*: If you know React-router than the route format should be familiar.

And lastly we can define our component, that is responsible to render your widgets based on the provided routes and found *DOM-mark*s.

```html
// Root.js

import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const Root = ({ store }) => (
	<Union routes={[HeroRoute]} />
);

export default Root;
```

We just use Union component and pass it an array of supported routes. In our case just `HeroRoute`.

When `<Union />` is mounted the `scan` process of HTML starts.

The scan process founds the DOM-marks according which the `<Union />` renders appropriate Widgets.
The scan is launched if either  `Union` is mounted or reference to routes changes.

So in the case above, the array of routes is made every render and it impacts the performance.
If there is no need for generating routes dynamically we can refactor above example to:

```html
// Root.js

import { Union } from 'react-union';
import HeroRoute from './HeroRoute';

const routes = [HeroRoute];

const Root = ({ store }) => (
	<Union routes={routes} />
);

export default Root;
```

## Components

### `<Union />`

Renders your widgets according to found *DOM-marks* and passed *routes*. Widgets are encapsulated in one virtual DOM even though widgets are distributed over the HTML in different parts.

#### Properties

* [`children`]\(*React node*) - Children of the `Union` component
* [`onEndScan`]\(*func*) - Called after the scan of the HTML is done
* [`onErrorScan`]\(*func*) - Called when there is an error while scanning of the HTML
* [`onStartScan`]\(*func*) - Called before the scan of the HTML
* [`parent`]\(*DOM element*) - Element in which the scan is running. By default `document.body`.
* [`routes`]\(*array of Route*) - Array of routes that are supported by your application. See section *Route*.

## DOM-mark

*DOM-mark* is used for description of:
- where to place widget within HTML,
- what widget should be rendered on the place (Based on *route*)
- to pass data from server to widget.

Firstly, there must be the `<script>` tag with data attribute `data-union-widget`. This tag contains JSON with properties described below.

### Properties
* [`name`]\(*string*) `required` -  Name of widget that is used to pair the route with the DOM mark. `path` of the route must equal to the `name` of the DOM mark to be paired.
* [`container`]\(*string*) - `id` attribute of HTML element in which the widget returned by route will be rendered. `container` should be unique within the scope of found DOM marks.
* [`namespace`]\(*string*) - String that can replace the unique code of *DOM-mark*. By default, the value of `namespace` is set to value within `container`.
* [`name`]\(*object*) - Any data that should be passed to the instance of a widget.

*NOTE:* At least one of properties `namespace` or `container` must be specified.

### Examples

**Simple**

It renders the widget returned by the route with the path `my-widget` to element with id `my-widget-root`.

```
<div id="my-widget-root"></div>

<!-- DOM-mark -->
<script data-union-widget="" type="application/json">{
	"name": "my-widget",
	"container": "my-widget-root"
}
</script>
```

**With `namespace`**

It renders the widget returned by the route with the path `my-widget` to the element with id `my-widget-root`. Internally the instance is saved under the key `unique-string` (provided by `namespace`).

```
<div id="my-widget-root"></div>

<!-- DOM-mark -->
<script data-union-widget="" type="application/json">{
	"name": "my-widget",
	"container": "my-widget-root",
	"namespace": "unique-string"
}
</script>
```

**Passing data**

If you need to provide custom data to the instance of your widget use `data` property.

```
<div id="my-widget-root"></div>

<!-- DOM-mark -->
<script data-union-widget="" type="application/json">{
	"name": "my-widget",
	"container": "my-widget-root",
	"data": {
		"customField": "custom field",
		"urls": {
			"home": "www.example.com",
			"api": "/api"
		}
	}
}
</script>
```

**Data Widget**

If you need to just provide a data to your application that there is no need to render anything.

```
<!-- DOM-mark -->
<script data-union-widget="" type="application/json">{
	"name": "my-widget",
	"namespace": "my-widget-namespace",
	"data": {
		"customField": "custom field",
		"urls": {
			"home": "www.example.com",
			"api": "/api"
		}
	}
}
</script>
```


## Route
The object that is used for pairing a DOM mark with Widget.

### Properties:
* [`path`]\(*string*) if there is the *DOM-mark* with `name` that equals to `path` than the route is used
* [`getComponents(done: function): undefined`]\(*function*) If `path` and `name` are matching, than the `getComponents` is called after `<Union />` finishes scan of the DOM.
`getComponents` has one argument `done`. You should call it after a load of your widget is done. You must pass the main React component of your widget as the argument of the `done`:

```js
// routeForMyWidget.js

export default {
	name: 'my-widget',
	getComponents(done) {
		require.ensure('./MyWidget')
			.then((MyWidget) => done(MyWidget))
	}
}
```

**note:** In the example above we use `require.ensure`. However, if you use React-union-scripts than there is a better way to async load your components. See `react-union-boilerplate-basic`.


## Utilities

### `justRender`

[`justRender(component: ReactComponent, htmlElementId: String)`] Wrapper over `ReactDOM.render`. You just need to provide component that you want to render.
	- [`component`] - required - Root component of your app,
	- [`htmlElementId`] - Id of HTML element where `component` should be rendered. If element is not found, `justRender` will create him. Defaults to `"union"`.

### `justUnmountComponentAtNode`
[`justUnmountComponentAtNode(component: ReactComponent, htmlElementId:String)`] Wrapper over `ReactDOM.unmountComponentAtNode`. You just need to provide component that you want to unmount.
	- [`component`] - required - Root component of your app,
	- [`htmlElementId`] - Id of HTML element where `component` should be unmounted.  Defaults to `"union"`.