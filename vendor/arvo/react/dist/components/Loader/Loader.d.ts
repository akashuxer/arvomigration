import { HTMLAttributes } from 'react';
/**
 * Animated shape variant.
 *
 *   - `dot`      -- three pulsing dots; lowest visual weight; best for
 *                   inline contexts (list rows, table cells,
 *                   button-adjacent loaders).
 *   - `circular` -- spinning arc; best for content areas, popovers,
 *                   and input trigger affixes.
 *   - `square`   -- corner-tracing tile; best for prominent page /
 *                   section loading states.
 */
export type ArvoLoaderVariant = 'dot' | 'circular' | 'square';
/** Size token. Drives shape dimensions, gap, and label font-size. */
export type ArvoLoaderSize = 'sm' | 'md' | 'lg';
/** Layout direction for the shape + label. */
export type ArvoLoaderOrientation = 'horizontal' | 'vertical';
/** Color treatment of the shape and label. */
export type ArvoLoaderTone = 'theme' | 'inverse' | 'subtle';
export interface ArvoLoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-label' | 'aria-live'> {
    /** Animated shape. Defaults to `'dot'`. */
    variant?: ArvoLoaderVariant;
    /** Visual size. Defaults to `'md'`. */
    size?: ArvoLoaderSize;
    /**
     * Layout direction. `'horizontal'` (default) places the label to the right of
     * the shape; `'vertical'` stacks the label below.
     */
    orientation?: ArvoLoaderOrientation;
    /**
     * Color treatment. `'theme'` (default) uses standard tokens; `'inverse'`
     * flips both icon and text for dark surfaces; `'subtle'` resolves to the
     * secondary tokens for low-emphasis contexts.
     */
    tone?: ArvoLoaderTone;
    /**
     * Accessible label + visible loading text. Pass `null` to hide the visible
     * label; the root still announces via `aria-label` so AT users receive the
     * status. Defaults to `'Loading'`.
     */
    message?: string | null;
    /** Additional CSS classes merged with the base BEM classes. */
    className?: string;
}
/**
 * Default fallback used for both the visible label (when `message` is the
 * default) AND the `aria-label` (when `message` is `null`). Keeping the
 * fallback colocated with the component ensures the React and JS sides
 * announce identical text.
 */
export declare const ARVO_LOADER_DEFAULT_MESSAGE = "Loading";
export declare const ARVO_LOADER_VARIANTS: readonly ArvoLoaderVariant[];
export declare const ARVO_LOADER_SIZES: readonly ArvoLoaderSize[];
export declare const ARVO_LOADER_ORIENTATIONS: readonly ArvoLoaderOrientation[];
export declare const ARVO_LOADER_TONES: readonly ArvoLoaderTone[];
declare const ArvoLoader: import('react').ForwardRefExoticComponent<ArvoLoaderProps & import('react').RefAttributes<HTMLDivElement>>;
export default ArvoLoader;
export { ArvoLoader };
//# sourceMappingURL=Loader.d.ts.map