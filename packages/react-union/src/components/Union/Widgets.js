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

const renderUnionWidget = ifElse(
	isNil,
	noop,
	map(config => <WidgetPortal key={config.mark.namespace || config.mark.container} {...config} />)
);

/**
 * Internal component of `Union`. It maps found `configs` to `WidgetPortal`s.
 */
const Widgets = o(renderUnionWidget, prop('configs'));

Widgets.propTypes = {
	/**
	 * Array of `Config`. See `ConfigShape`.
	 */
	configs: PropTypes.arrayOf(PropTypes.shape(ConfigShape)),
};

export default Widgets;
