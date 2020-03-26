import React from 'react';
import { Link } from '@union-liferay/ui-components';

import logo from './logo.png';

const Root = () => (
	<div>
		<img src={logo} />
		<nav>
			<ul>
				<li>
					<Link to="/">Link using Senna</Link>
				</li>
				<li>
					<Link href="/">Link with refresh</Link>
				</li>
			</ul>
		</nav>
	</div>
);

export default Root;
