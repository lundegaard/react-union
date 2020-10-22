<p align="center">
  <a href="https://react-union.org">
    <img alt="React Union" src="https://github.com/lundegaard/react-union/raw/master/logo.svg" width="300" />
  </a>
</p>

<p align="center">
  <a href="https://lundegaard.eu">
    <img alt="by Lundegaard" src="https://github.com/lundegaard/react-union/raw/master/by-lundegaard.png" width="120" />
  </a>
</p>

<h3 align="center">
🖍️ 🛡  🚀
</h3>

<h3 align="center">
Easy React integration into legacy systems 
</h3>

<p align="center">
React Union is a library for rendering React applications in CMS-like environments. It allows you to treat your React applications as widgets, meaning that the user gets to choose the combination and location of widgets for any given page.
</p>

<p align="center">
<a href="https://react-union.org">See our documentation site.</a>
</p>

<p align="center">

<a href="https://travis-ci.org/lundegaard/react-union">
<img src="https://img.shields.io/travis/lundegaard/react-union/master.svg?style=flat-square" alt="Build status" />
</a>

<a href="https://greenkeeper.io/">
<img src="https://badges.greenkeeper.io/lundegaard/react-union.svg" alt="Greenkeeper badge" />
</a>

<a href="https://github.com/lundegaard/react-union">
<img src="https://flat.badgen.net/badge/-/github?icon=github&label" alt="Github" />
</a>

<img src="https://flat.badgen.net/badge/license/MIT/blue" alt="MIT License" />

<a href="https://www.npmjs.com/package/react-union">
<img src="https://flat.badgen.net/npm/dm/react-union" alt="Downloads" />
</a>

<a href="https://www.npmjs.com/package/react-union">
<img src=" https://flat.badgen.net/npm/v/react-union" alt="Version" />
</a>
</p>


The main idea is that instead of rendering the application directly, we render HTML fragments which describe the widgets to render. We call them [widget descriptors](https://react-union.org/union-component-widget-descriptors). React Union then parses the HTML output and renders the React application, which uses a single virtual DOM, making it trivial to reuse e.g. Redux state across widgets.

See https://react-union.org/union-component-introduction for more information.
