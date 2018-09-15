import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NestedComponent from './NestedComponent';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class Root extends Component {
	static async getInitialProps() {
		await sleep(1000);
		return { asyncData: 'This content was loaded after a second!' };
	}

	static propTypes = {
		asyncData: PropTypes.string,
		data: PropTypes.shape({ foo: PropTypes.string }),
		namespace: PropTypes.string,
	};

	render() {
		const { asyncData, data, namespace } = this.props;

		return (
			<div>
				I am the Content widget. My namespace is <b>{namespace}</b> and my initial data is
				<b> {JSON.stringify(data)}</b>.<NestedComponent />
				<div>{asyncData || 'Fetching data...'}</div>
			</div>
		);
	}
}

export default Root;
