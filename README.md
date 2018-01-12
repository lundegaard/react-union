# React-union project

The project React-union is collection of tools that allows you to build modern React applications that runs on specific server-side enviroments such as Content Management Systems or Portals.

## Tools and libraries
* React-union - React component that can build the app with just one virtual DOM from multiple HTML fragments.
* React-union-scripts - JavaScript SDK focused on large codebases. Supports multiple entry points, async code-splitting, sharing the code between modules, etc.
* eslint-config-react-union - ESLint confiuration that we use in the React-union project.

## Examples
* Basic boilerplate - Shows how react-union-scripts and react-union component works together in simple React application.

More are comming! See roadmap.

## Word about Content Management Systems, Portals and React applications

In these types of systems there are some problems that must be solved if we want to achieve the modern developer's experience with features such as HMR, time traveling of app state, ECMAScript 7+ syntax, ...

## Where are these problems?

* **Ad-hoc rendering of components.** We don't know in advance about the combination of widgets for the particular page view. Due to fact that user is able to customize what widgets should be rendered for each page/view.
* **There can exist multiple instances of the same widget.** E. g. image galleries, feeds, calendars...
* **Sharing and synchronization of data between the widgets.** Even though the widgets must be independent on each other, the model/data they are working with must be possible to share.
* **Build optimalization.** Application code have to be splitted into several chunks to serve only necessary code for current page.
* **Passing data from server.** There are cases where our widgets needs to be provided by data from server, e.g. information about user, preferences, color schema etc.
