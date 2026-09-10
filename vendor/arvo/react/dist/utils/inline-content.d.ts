import { default as React } from 'react';
import { InlineContent, InlineContentAdapter, RenderInlineContentOptions } from '../../../core/src';
type ReactInlineNode = React.ReactNode;
export declare const reactInlineAdapter: InlineContentAdapter<ReactInlineNode>;
/**
 * Renders an `InlineContent` value into a React node. Always returns a
 * fragment-equivalent node so it can be embedded directly inside any JSX
 * parent. Strings are passed through as text.
 */
export declare function renderInlineContentReact(content: InlineContent, options?: RenderInlineContentOptions): React.ReactNode;
export {};
//# sourceMappingURL=inline-content.d.ts.map