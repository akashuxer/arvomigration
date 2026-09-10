import { Locale } from '../../../core/src';
/**
 * Reserved locale hook (OQ-12).
 *
 * V1 contract: always returns `undefined`. The React picker adapters MUST call
 * this hook and pass the result through to the engine as the `locale` override
 * argument (e.g. `parseDate(value, format, useArvoLocale() ?? localeProp)` or
 * via `createSegmentController({ locale })`). Because it returns `undefined`
 * today, the engine's own resolution cascade applies:
 *
 *   explicit `locale` prop
 *     -> ArvoLocaleProvider (this hook, reserved)
 *     -> configureDateTime({ locale })
 *     -> <html lang>
 *     -> 'en-US'
 *
 * Wiring every picker through this hook now means the future provider is a
 * non-breaking, drop-in addition.
 */
export declare function useArvoLocale(): Locale | undefined;
//# sourceMappingURL=useArvoLocale.d.ts.map