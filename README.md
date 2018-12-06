# React Union

[![build status](https://img.shields.io/travis/lundegaard/react-union/master.svg?style=flat-square)](https://travis-ci.org/lundegaard/react-union) [![Greenkeeper badge](https://badges.greenkeeper.io/lundegaard/react-union.svg)](https://greenkeeper.io/)

The React Union project is a collection of tools that allow you to build modern React applications for content management systems or enterprise portals.

## Tools and libraries

* [React Union](https://github.com/lundegaard/react-union/tree/master/packages/react-union) - React component that can assemble an application with one virtual DOM from multiple HTML fragments.
* [React Union Scripts](https://github.com/lundegaard/react-union/tree/master/packages/react-union-scripts) - JavaScript SDK focused on a large codebase. Supports multiple entry points, async code-splitting, sharing the code between modules, etc.
* [ESLint config](https://github.com/lundegaard/react-union/tree/master/packages/eslint-config-react-union) - ESLint configuration that is used within the React Union project.
* [Babel preset](https://github.com/lundegaard/react-union/tree/master/packages/babel-preset-react-union) - Babel preset used within the React Union project.

## Examples

* [Basic boilerplate](https://github.com/lundegaard/react-union/tree/master/boilerplates/react-union-boilerplate-basic) - Reference usage of React Union in a simple application.
* [Monorepo boilerplate](https://github.com/lundegaard/react-union/tree/master/boilerplates/react-union-boilerplate-monorepo) - For larger projects, a monorepo (Yarn Workspaces) is a good choice. 
* [Integration with Liferay](https://github.com/lundegaard/react-union/tree/master/boilerplates/react-union-boilerplate-liferay-basic)

More examples are coming! See the [roadmap](https://github.com/lundegaard/react-union/blob/master/ROADMAP.md).

## Content management systems, enterprise portals and React applications

There are some problems in these types of systems that need to be addressed in order to achieve a proper developer experience. This includes features such as HMR, application state time travel, ECMAScript 7+ syntax, etc. Additionally, there are problems regarding the nature of CMS and Portal solutions.

### What are these problems?

* **Ad-hoc component rendering.** We don't know the combination of widgets for any particular URL in advance. It is due to the fact that the user is able to customize what widgets should be rendered.
* **Multiple instances of the same widget in one view.** E.g. image galleries, feeds or calendars. This fact adds complexity to managing application state, passing initial data, etc.
* **Sharing and synchronization of data between widgets.** Even though the widgets have to be independent of each other, we have to be able to share the model/data they are working with.
* **Build optimization.** Application code has to be split into several chunks to only serve code necessary for the current page.
* **Passing data from a server.** There are cases where our widgets need to be provided data from a server, e.g. information about the user, preferences, color schema, etc.
