import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NestedComponent from './NestedComponent';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class Root extends Component {
	static async getInitialProps({ req }) {
		// NOTE: req is defined iff this method is executed in server context
		// This is to simulate that fetching data in a local network is faster than roundtrips
		await sleep(req ? 10 : 1000);
		return { asyncData: 'This is some async content!' };
	}

	static propTypes = {
		asyncData: PropTypes.string,
		data: PropTypes.shape({ foo: PropTypes.string }),
		namespace: PropTypes.string,
	};

	static defaultProps = {
		asyncData: 'Fetching...',
	};

	render() {
		const { asyncData, data, namespace } = this.props;

		return (
			<div>
				I am the Content widget. My namespace is <b>{namespace}</b> and my initial data is
				<b> {JSON.stringify(data)}</b>.<NestedComponent />
				<div>{asyncData}</div>
			</div>
		);
	}
}

export default Root;
