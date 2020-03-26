import React, { Fragment, useState } from 'react';

const Root = () => {
	const [counter, setCounter] = useState(0);

	return (
		<Fragment>
			<p>
				<strong>{counter}</strong>
			</p>
			<button onClick={() => setCounter(x => x + 1)} type="button">
				+
			</button>
		</Fragment>
	);
};

export default Root;
