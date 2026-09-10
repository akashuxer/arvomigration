export interface ArvoImageViewItem {
    id?: string;
    src: string;
    previewSrc?: string;
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
}
export type ArvoImageViewMode = 'fit' | 'actualPixels';
export interface ArvoImageViewProps {
    items?: ArvoImageViewItem[];
    activeIndex?: number;
    defaultActiveIndex?: number;
    isOpen?: boolean;
    viewMode?: ArvoImageViewMode;
    hasBackdrop?: boolean;
    closeOnBackdropPress?: boolean;
    closeOnEscape?: boolean;
    isDisabled?: boolean;
    isLooping?: boolean;
    zoom?: number;
    defaultZoom?: number;
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
    allowUpscale?: boolean;
    hasPositionIndicator?: boolean;
    navigationControls?: 'auto' | 'always' | 'never';
    initialFocus?: 'auto' | 'body' | 'footer' | 'header' | 'custom';
    onOpenChange?: (isOpen: boolean) => void;
    onActiveIndexChange?: (index: number, item: ArvoImageViewItem | null) => void;
    onZoomChange?: (zoom: number) => void;
}
type ArvoImageViewJsInstance = {
    update: (options: ArvoImageViewProps) => void;
    destroy: () => void;
};
export declare const ArvoImageView: import('react').ForwardRefExoticComponent<ArvoImageViewProps & import('react').RefAttributes<ArvoImageViewJsInstance | null>>;
export {};
//# sourceMappingURL=ImageView.d.ts.map