# React-union

React-union is a library for rendering React applications in CMS-like environments. It allows you to treat your React applications as widgets, meaning that the user gets to choose the combination and location of widgets for any given page.

The main idea is that instead of rendering the application directly, we render HTML fragments which describe the widgets to render. We call them [widget descriptors](https://react-union.org/union-component-widget-descriptors). React-union then parses the HTML output and renders the React application, which uses a single virtual DOM, making it trivial to reuse e.g. Redux state across widgets.

See https://react-union.org/union-component-introduction for more information.
