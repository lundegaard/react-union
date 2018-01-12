var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import PropTypes from 'prop-types';
import React from 'react';
import isNil from 'ramda/src/isNil';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import o from 'ramda/src/o';
import ifElse from 'ramda/src/ifElse';

import { noop } from '../../utils';
import { ConfigShape } from '../../shapes';

import WidgetPortal from './WidgetPortal';

var renderUnionWidget = ifElse(isNil, noop, map(function (config) {
	return React.createElement(WidgetPortal, _extends({ key: config.mark.namespace || config.mark.container }, config));
}));

var Widgets = o(renderUnionWidget, prop('configs'));

Widgets.propTypes = {
	configs: PropTypes.arrayOf(PropTypes.shape(ConfigShape))
};

export default Widgets;