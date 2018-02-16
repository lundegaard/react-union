# Roadmap to v1.0.0

Breaking Changes:

* store arg is not in route.getComponent
* START_SCAN, END_SCAN instead of START_BOOT, END_BOOT
* diffrent run of scan - Using Union component

```
[*] Monorepo with Yarn workspaces
[ ] Travis build/release
[ ] Prettier
[ ] Husky
[ ] react-union-scripts init
	[ ] new widget
	[ ] new project from boilerplate
[*] READMEs
[ ] react-union-scripts test
[ ] Detailed documentation
	[ ] Github Wiki or Web docs
[ ] Examples/Recipes
	[*] Basic
	[ ] Basic with Redux
	[ ] Liferay 7 + Senna
	[ ] Real world - widget communication, styles, resources, JWT, INTL, Persmissions
	[ ] Other CMS - Wordpress, Joomla, KeystoneJS, ...
[ ] Tests
[ ] Own repos for:
	[ ] R.injectableStore
[ ] union.config.js validator
	[ ] missing options
	[ ] name of the module cannot contain special characters
[ ] Minor tasks
	[*] Fix hardcoded webpack resolver for eslint import plugin
	[ ] Update babel
	[ ] Fill in "package.json"s
		[ ] repository
		[ ] authors
		[ ] VIVO to keywords?
	[ ] Possible integrations "xo"
```
