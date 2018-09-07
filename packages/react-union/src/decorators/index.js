import { createContextDecorator } from '../utils';
import { ServerContext, WidgetContext } from '../contexts';

export { default as withErrorBoundary } from './withErrorBoundary';
export const withServerContext = createContextDecorator(ServerContext, 'ServerContext');
export const withWidgetContext = createContextDecorator(WidgetContext, 'WidgetContext');
