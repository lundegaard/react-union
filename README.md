# React-union project

The project React-union is the collection of tools that allows you to build modern React applications that runs at specific server-side enviroments such as Content Management Systems or Portals.

## Tools and libraries
* (React-union)[https://github.com/lundegaard/react-union/tree/master/packages/react-union] - React component that can assemble the application with one virtual DOM from multiple HTML fragments.
* [React-union-scripts](https://github.com/lundegaard/react-union/tree/master/packages/react-union-scripts) - JavaScript SDK focused on large codebase. Supports multiple entry points, async code-splitting, sharing the code between modules, etc.
* [eslint-config-react-union](https://github.com/lundegaard/react-union/tree/master/packages/eslint-config-react-union) - ESLint configuration that is used within the React-union project.

## Examples
* [Basic boilerplate](https://github.com/lundegaard/react-union/tree/master/packages/react-union-boilerplate-basic) - Shows projects [React-union-scripts](https://github.com/lundegaard/react-union/tree/master/packages/react-union-scripts) and (React-union)[https://github.com/lundegaard/react-union/tree/master/packages/react-union] component in simple React application.

More exampoles are comming! See [roadmap](https://github.com/lundegaard/react-union/blob/master/ROADMAP.md).

## Word about Content Management Systems, Portals and React applications

In these types of systems there are some problems that must be solved if we want to achieve the modern developer's experience with features such as HMR, time traveling of application state, ECMAScript 7+ syntax, etc.

### Where are these problems?

* **Ad-hoc rendering of components.** We don't know in advance about the combination of widgets for the particular URL. Due to fact that user is able to customize what widgets should be rendered.
* **Multiple instances of the same widget on one view.** E. g. image galleries, feeds or calendars. The fact adds complexity to managing of application state etc.
* **Sharing and synchronization of data between the widgets.** Even though the widgets must be independent on each other, the model/data they are working with must be possible to share.
* **Build optimalization.** Application code have to be splitted into several chunks to serve only necessary code for current page.
* **Passing data from server.** There are cases where our widgets needs to be provided by data from server, e.g. information about user, preferences, color schema etc.
