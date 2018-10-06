import { createContextDecorator } from '../utils';
import { PrescanContext, WidgetContext } from '../contexts';

export { default as withErrorBoundary } from './withErrorBoundary';
export const withPrescanContext = createContextDecorator(PrescanContext, 'PrescanContext');
export const withWidgetContext = createContextDecorator(WidgetContext, 'WidgetContext');
