var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import { createPortal } from 'react-dom';

import { warning, invariant } from '../../utils';
import { ConfigShape } from '../../shapes';

import WidgetProvider from '../WidgetProvider';

var WidgetPortal = function WidgetPortal(_ref) {
	var WidgetComponent = _ref.component,
	    mark = _ref.mark;

	var name = mark.name,
	    container = mark.container,
	    namespace = mark.namespace,
	    rest = _objectWithoutProperties(mark, ['name', 'container', 'namespace']);

	var resolvedNamespace = namespace || container;

	invariant(!WidgetComponent || container, 'Missing attribute "container" for the widget "' + name + '" to be rendered.');

	var widgetProps = { namespace: resolvedNamespace };
	var el = document.getElementById(container);

	warning(el, 'HTML container with id "' + container + '" is not found for widget wtih name "' + name + '"');

	return WidgetComponent && el ? createPortal(React.createElement(
		WidgetProvider,
		widgetProps,
		React.createElement(WidgetComponent, _extends({}, widgetProps, rest))
	), el) : null;
};

WidgetPortal.propTypes = _extends({}, ConfigShape);

export default WidgetPortal;