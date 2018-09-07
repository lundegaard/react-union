import React from 'react';
import { WidgetContext } from 'react-union';

const NestedComponent = () => (
	<WidgetContext.Consumer>
		{({ namespace, data }) => (
			<div>
				I am a nested component of widget Content. I also have namespace <b>{namespace}</b> and
				initial data <b>{JSON.stringify(data)}</b>, but from WidgetContext :P
			</div>
		)}
	</WidgetContext.Consumer>
);

export default NestedComponent;
