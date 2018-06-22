import React from 'react';
import { WidgetContext } from 'react-union';

const NestedComponent = () => (
	<WidgetContext.Consumer>
		{({ namespace, data }) => (
			<div>
				Im nested component of Content. I have also namespace: <b>{namespace}</b> and initial data:
				<b>{JSON.stringify(data)}</b>. But taken from context :p.
			</div>
		)}
	</WidgetContext.Consumer>
);

export default NestedComponent;
