import { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react';
export type ArvoImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ArvoImageLoading = 'lazy' | 'eager';
export type ArvoImageDecoding = 'async' | 'sync' | 'auto';
export type ArvoImageFetchPriority = 'high' | 'low' | 'auto';
export type ArvoImageState = 'loading' | 'ready' | 'error' | 'empty';
export type ArvoImageControlledState = 'default' | ArvoImageState;
export type ArvoImageAspectRatio = 'auto' | '1/1' | '1/2' | '2/3' | '3/4' | '9/16' | '2/1' | '3/2' | '4/1' | '4/3' | '16/9' | `${number}/${number}`;
export interface ArvoImageSource {
    media?: string;
    srcSet: string;
    sizes?: string;
    type?: string;
}
export interface ArvoImageOverlay {
    title: string;
    subtitle?: string;
}
export interface ArvoImageProps {
    src?: string;
    alt?: string;
    sources?: ArvoImageSource[];
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
    aspectRatio?: ArvoImageAspectRatio;
    fit?: ArvoImageFit;
    position?: CSSProperties['objectPosition'];
    loading?: ArvoImageLoading;
    decoding?: ArvoImageDecoding;
    fetchPriority?: ArvoImageFetchPriority;
    crossOrigin?: ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
    referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
    state?: ArvoImageControlledState;
    fallback?: ReactNode | ((state: ArvoImageState) => ReactNode);
    caption?: ReactNode;
    overlay?: ArvoImageOverlay | null;
    overlayTitle?: string;
    overlaySubtitle?: string;
    hasPreview?: boolean;
    isDecorative?: boolean;
    ariaDescribedBy?: string;
    className?: string;
    style?: CSSProperties;
    id?: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    onPreviewOpen?: () => void;
}
export declare const ArvoImage: import('react').ForwardRefExoticComponent<ArvoImageProps & import('react').RefAttributes<HTMLElement>>;
//# sourceMappingURL=Image.d.ts.map