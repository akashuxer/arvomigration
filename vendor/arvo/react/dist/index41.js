import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { forwardRef, useState } from "react";
import ArvoEmptyState from "./index88.js";
const ratioToCss = (aspectRatio, width, height) => {
  if (aspectRatio !== "auto") return aspectRatio;
  return width && height ? `${width} / ${height}` : void 0;
};
const defaultFallback = (state) => {
  if (state === "loading") {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "arvo-img__skeleton", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("span", { className: "arvo-sr-only", children: "Loading image" })
    ] });
  }
  if (state === "error") {
    return /* @__PURE__ */ jsx(
      ArvoEmptyState,
      {
        size: "sm",
        illustration: "no-data",
        title: "Image could not be loaded",
        message: "Check the source URL or try again.",
        isAnimated: false
      }
    );
  }
  if (state === "empty") {
    return /* @__PURE__ */ jsx(
      ArvoEmptyState,
      {
        size: "sm",
        illustration: "no-data",
        title: "No image available",
        message: "Add an image source to preview it here.",
        isAnimated: false
      }
    );
  }
  return null;
};
const ArvoImage = forwardRef(function ArvoImage2({
  src = "",
  alt = "",
  sources = [],
  srcSet,
  sizes,
  width,
  height,
  aspectRatio = "auto",
  fit = "cover",
  position = "center",
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  crossOrigin,
  referrerPolicy,
  state,
  fallback,
  caption,
  overlay,
  overlayTitle,
  overlaySubtitle,
  hasPreview = false,
  isDecorative = false,
  ariaDescribedBy,
  className,
  style,
  id,
  onLoad,
  onError,
  onPreviewOpen
}, ref) {
  const [internalState, setInternalState] = useState(src ? "loading" : "empty");
  const controlledState = state === "default" ? void 0 : state;
  const resolvedState = controlledState ?? (!src ? "empty" : internalState);
  const cssRatio = ratioToCss(aspectRatio, width, height);
  const mergedStyle = {
    ...style,
    "--arvo-img-fit": fit,
    "--arvo-img-position": position,
    ...cssRatio ? { "--arvo-img-ratio": cssRatio } : null
  };
  const stateLayer = resolvedState !== "ready" ? (typeof fallback === "function" ? fallback(resolvedState) : fallback) ?? defaultFallback(resolvedState) : null;
  const FrameTag = hasPreview ? "button" : "div";
  const resolvedOverlay = (overlayTitle == null ? void 0 : overlayTitle.trim()) ? {
    title: overlayTitle.trim(),
    ...(overlaySubtitle == null ? void 0 : overlaySubtitle.trim()) ? { subtitle: overlaySubtitle.trim() } : null
  } : overlay;
  return /* @__PURE__ */ jsx(
    "section",
    {
      ref,
      id,
      className: [
        "arvo-img",
        `arvo-img--fit-${fit}`,
        hasPreview ? "arvo-img--previewable" : "",
        resolvedOverlay ? "arvo-img--has-overlay" : "",
        caption ? "arvo-img--has-caption" : "",
        className ?? ""
      ].filter(Boolean).join(" "),
      style: mergedStyle,
      children: /* @__PURE__ */ jsxs("figure", { className: "arvo-img__figure", children: [
        /* @__PURE__ */ jsxs(
          FrameTag,
          {
            className: "arvo-img__frame",
            "data-state": resolvedState,
            type: hasPreview ? "button" : void 0,
            disabled: hasPreview ? resolvedState !== "ready" : void 0,
            "aria-label": hasPreview ? alt ? `Preview ${alt}` : "Preview image" : void 0,
            onClick: hasPreview ? onPreviewOpen : void 0,
            children: [
              src && resolvedState !== "empty" && /* @__PURE__ */ jsxs("picture", { className: "arvo-img__picture", children: [
                sources.map((source, index) => /* @__PURE__ */ jsx(
                  "source",
                  {
                    srcSet: source.srcSet,
                    media: source.media,
                    sizes: source.sizes,
                    type: source.type
                  },
                  `${source.srcSet}-${index}`
                )),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    className: "arvo-img__asset",
                    src,
                    alt: isDecorative ? "" : alt,
                    role: isDecorative ? "presentation" : void 0,
                    "aria-describedby": !isDecorative ? ariaDescribedBy : void 0,
                    srcSet,
                    sizes,
                    width,
                    height,
                    loading,
                    decoding,
                    fetchPriority,
                    crossOrigin,
                    referrerPolicy,
                    onLoad: (event) => {
                      if (!controlledState) setInternalState("ready");
                      onLoad == null ? void 0 : onLoad(event);
                    },
                    onError: (event) => {
                      if (!controlledState) setInternalState("error");
                      onError == null ? void 0 : onError(event);
                    }
                  }
                )
              ] }),
              stateLayer && /* @__PURE__ */ jsx("div", { className: `arvo-img__state arvo-img__state--${resolvedState}`, "aria-live": resolvedState === "error" ? "polite" : "off", children: stateLayer }),
              resolvedOverlay && resolvedState !== "empty" && resolvedState !== "error" && /* @__PURE__ */ jsxs("div", { className: "arvo-img__overlay", children: [
                /* @__PURE__ */ jsx("div", { className: "arvo-img__overlay-title", children: resolvedOverlay.title }),
                resolvedOverlay.subtitle && /* @__PURE__ */ jsx("div", { className: "arvo-img__overlay-subtitle", children: resolvedOverlay.subtitle })
              ] }),
              hasPreview && resolvedState === "ready" && /* @__PURE__ */ jsx("span", { className: "arvo-img__preview", children: /* @__PURE__ */ jsx("i", { className: "o9con o9con-zoom-in", "aria-hidden": "true" }) })
            ]
          }
        ),
        caption && /* @__PURE__ */ jsx("figcaption", { className: "arvo-img__caption", children: caption })
      ] })
    }
  );
});
export {
  ArvoImage
};
//# sourceMappingURL=index41.js.map
