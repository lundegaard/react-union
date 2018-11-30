import React from 'react';
import { WidgetContext } from 'react-union';

const NestedComponent = () => (
	<WidgetContext.Consumer>
		{({ namespace, data }) => (
			<div>
				I am a nested component of the Content widget. My namespace is <b>{namespace}</b> and my
				initial data is <b>{JSON.stringify(data)}</b> as well, but I use WidgetContext to access
				this information.
			</div>
		)}
	</WidgetContext.Consumer>
);

export default NestedComponent;
