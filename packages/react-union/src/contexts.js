import { createContext } from 'react';

export const WidgetContext = createContext({
	data: undefined,
	namespace: undefined,
});

export const RenderingContext = createContext({
	isServer: false,
	scanResult: null,
});
