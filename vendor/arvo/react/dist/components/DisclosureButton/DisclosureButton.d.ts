export interface ArvoDisclosureButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    /** Visible button text. The label is consumer-controlled and is expected
     *  to flip when the consumer flips `isExpanded` (e.g. between `Show more`
     *  and `Show less`, or between `+4 more` and `Show less`). */
    label: string;
    /** Selects font, chevron container, and gap tokens. Defaults to `md`. */
    size?: 'sm' | 'md' | 'lg';
    /** Controlled expanded/collapsed state. Maps directly to `aria-expanded`.
     *  Omit to run uncontrolled with `defaultExpanded`. */
    isExpanded?: boolean;
    /** Uncontrolled initial expanded state. Ignored when `isExpanded` is
     *  supplied (the parent then owns state). */
    defaultExpanded?: boolean;
    /** Show or hide the built-in trailing chevron. Defaults to `true`. The
     *  glyph itself is not configurable -- it always renders as `angle-down`
     *  and rotates 180deg via CSS when `isExpanded` is true. */
    hasChevron?: boolean;
    /** Fired when the user requests a state change via click, Enter, or Space.
     *  Receives the next `isExpanded` value. */
    onExpandedChange?: (isExpanded: boolean) => void;
}
declare const ArvoDisclosureButton: import('react').ForwardRefExoticComponent<ArvoDisclosureButtonProps & import('react').RefAttributes<HTMLButtonElement>>;
export default ArvoDisclosureButton;
//# sourceMappingURL=DisclosureButton.d.ts.map