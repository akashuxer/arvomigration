import { jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const TYPE_REGISTRY = {
  available: { icon: "basicshape-circle", label: "Available", iconOverridable: false },
  notAvailable: { icon: "circle-shape", label: "Not available", iconOverridable: false },
  partialComplete: { icon: "adjust", label: "Partial complete", iconOverridable: false },
  busy: { icon: "minus-circle", label: "Busy", iconOverridable: false },
  failed: { icon: "times-circle", label: "Failed", iconOverridable: false },
  blocked: { icon: "blocker-action-filled", label: "Blocked", iconOverridable: false },
  attention: { icon: "basicshape-circle", label: "Attention", iconOverridable: false },
  loading: { icon: "spinner", label: "Loading", iconOverridable: false },
  paused: { icon: "on-hold", label: "Paused", iconOverridable: false },
  critical: { icon: "square", label: "Critical", iconOverridable: false },
  high: { icon: "chevron-circle-up", label: "High", iconOverridable: false },
  medium: { icon: "basicshape-hexagon", label: "Medium", iconOverridable: false },
  low: { icon: "chevron-circle-down", label: "Low", iconOverridable: false },
  unknown: { icon: "question-circle", label: "Unknown", iconOverridable: false },
  positive: { icon: "check-circle", label: "Positive", iconOverridable: true },
  negative: { icon: "exclamation-circle-filled", label: "Negative", iconOverridable: true },
  warning: { icon: "exclamation-triangle-filled", label: "Warning", iconOverridable: true },
  info: { icon: "info-circle-filled", label: "Info", iconOverridable: true },
  // `neutral` has no default glyph; the fallback is `camera-retro` so the
  // container never renders empty when the consumer omits the icon override.
  neutral: { icon: null, label: "Neutral", iconOverridable: true }
};
const NEUTRAL_ICON_FALLBACK = "camera-retro";
const VALID_TYPES = Object.keys(TYPE_REGISTRY);
const VALID_SIZES = ["sm", "md", "lg"];
const VALID_PLACEMENTS = ["inline", "top-right", "bottom-right"];
const ARVO_STATUS_TYPES = VALID_TYPES;
const ARVO_STATUS_TYPE_REGISTRY = TYPE_REGISTRY;
const ARVO_STATUS_PLACEMENTS = VALID_PLACEMENTS;
function resolveStatusIcon(type, override) {
  const meta = TYPE_REGISTRY[type];
  if (meta.iconOverridable && override) return override;
  if (meta.icon) return meta.icon;
  return NEUTRAL_ICON_FALLBACK;
}
function resolveStatusLabel(type) {
  return TYPE_REGISTRY[type].label;
}
const ArvoStatus = forwardRef(
  function ArvoStatus2({
    type = "positive",
    size = "lg",
    placement = "inline",
    tooltip,
    icon,
    className
  }, ref) {
    const safeType = VALID_TYPES.includes(type) ? type : "positive";
    const safeSize = VALID_SIZES.includes(size) ? size : "lg";
    const safePlacement = VALID_PLACEMENTS.includes(placement) ? placement : "inline";
    const resolvedIcon = resolveStatusIcon(safeType, icon);
    const resolvedLabel = tooltip ?? resolveStatusLabel(safeType);
    const classes = [
      "arvo-sts",
      `arvo-sts--${safeSize}`,
      `arvo-sts--${safeType}`,
      `arvo-sts--${safePlacement}`,
      className ?? ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ jsx(
      "span",
      {
        ref,
        className: classes,
        role: "img",
        "aria-label": resolvedLabel,
        title: resolvedLabel,
        children: /* @__PURE__ */ jsx(
          "i",
          {
            className: `arvo-sts__ico o9con o9con-${resolvedIcon}`,
            "aria-hidden": "true"
          }
        )
      }
    );
  }
);
export {
  ARVO_STATUS_PLACEMENTS,
  ARVO_STATUS_TYPES,
  ARVO_STATUS_TYPE_REGISTRY,
  ArvoStatus,
  ArvoStatus as default,
  resolveStatusIcon,
  resolveStatusLabel
};
//# sourceMappingURL=index14.js.map
