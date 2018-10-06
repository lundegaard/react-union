import { createContext } from 'react';

export const WidgetContext = createContext({
	data: undefined,
	namespace: undefined,
});

export const PrescanContext = createContext({
	initialProps: undefined,
	widgetConfigs: undefined,
});
