import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const VALID_VARIANTS = ["dot", "circular", "square"];
const VALID_SIZES = ["sm", "md", "lg"];
const VALID_ORIENTATIONS = ["horizontal", "vertical"];
const VALID_TONES = ["theme", "inverse", "subtle"];
const ARVO_LOADER_DEFAULT_MESSAGE = "Loading";
const ARVO_LOADER_VARIANTS = VALID_VARIANTS;
const ARVO_LOADER_SIZES = VALID_SIZES;
const ARVO_LOADER_ORIENTATIONS = VALID_ORIENTATIONS;
const ARVO_LOADER_TONES = VALID_TONES;
const ArvoLoader = forwardRef(function ArvoLoader2({
  variant = "dot",
  size = "md",
  orientation = "horizontal",
  tone = "theme",
  message = ARVO_LOADER_DEFAULT_MESSAGE,
  className,
  ...rest
}, ref) {
  const safeVariant = VALID_VARIANTS.includes(variant) ? variant : "dot";
  const safeSize = VALID_SIZES.includes(size) ? size : "md";
  const safeOrientation = VALID_ORIENTATIONS.includes(orientation) ? orientation : "horizontal";
  const safeTone = VALID_TONES.includes(tone) ? tone : "theme";
  const visibleMessage = typeof message === "string" && message.length > 0 ? message : null;
  const ariaLabel = visibleMessage ?? ARVO_LOADER_DEFAULT_MESSAGE;
  const classes = [
    "arvo-loader",
    `arvo-loader--${safeVariant}`,
    `arvo-loader--${safeSize}`,
    `arvo-loader--${safeOrientation}`,
    `arvo-loader--${safeTone}`,
    className ?? ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: classes,
      role: "status",
      "aria-live": "polite",
      "aria-label": ariaLabel,
      ...rest,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "arvo-loader__shape", "aria-hidden": "true", children: [
          safeVariant === "dot" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "arvo-loader__dot" }),
            /* @__PURE__ */ jsx("span", { className: "arvo-loader__dot" }),
            /* @__PURE__ */ jsx("span", { className: "arvo-loader__dot" })
          ] }),
          safeVariant === "circular" && /* @__PURE__ */ jsx("span", { className: "arvo-loader__circle" }),
          safeVariant === "square" && /* @__PURE__ */ jsx("span", { className: "arvo-loader__square" })
        ] }),
        visibleMessage && /* @__PURE__ */ jsx("span", { className: "arvo-loader__msg", children: visibleMessage })
      ]
    }
  );
});
export {
  ARVO_LOADER_DEFAULT_MESSAGE,
  ARVO_LOADER_ORIENTATIONS,
  ARVO_LOADER_SIZES,
  ARVO_LOADER_TONES,
  ARVO_LOADER_VARIANTS,
  ArvoLoader
};
//# sourceMappingURL=index15.js.map
