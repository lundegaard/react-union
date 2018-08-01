import { createContext } from 'react';

export const WidgetContext = createContext({
	data: undefined,
	namespace: undefined,
	rawCommonData: undefined,
});
