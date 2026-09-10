"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const useControllableState = require("./index90.cjs");
const ChipListContext = require("./index104.cjs");
const Status = require("./index14.cjs");
const Badge = require("./index45.cjs");
const IconButton = require("./index17.cjs");
const MessageAlert = require("./index13.cjs");
const Tooltip = require("./index65.cjs");
function resolveColorClass(colorMode, appearance, semanticType, customColor) {
  if (colorMode === "semantic" && semanticType !== "none") return `arvo-chip--${semanticType}`;
  if (colorMode === "custom" || appearance === "utility") return `arvo-chip--${customColor}`;
  return "";
}
function useTruncationOverflow(elRef) {
  const [overflowing, setOverflowing] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const measure = () => {
      setOverflowing(el.scrollWidth - el.clientWidth >= 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [elRef]);
  return overflowing;
}
const ArvoChip = React.forwardRef(function ArvoChip2({
  variant: variantProp,
  size: sizeProp,
  appearance: appearanceProp,
  colorMode: colorModeProp,
  semanticType = "none",
  customColor = "purple",
  label,
  title,
  icon,
  avatar,
  status,
  counter,
  tooltip,
  validationMessage,
  isSelected: selectedProp,
  defaultSelected = false,
  isDisabled: isDisabledProp,
  isReadOnly: isReadOnlyProp,
  isInvalid = false,
  isWarning = false,
  isExcluded = false,
  isLoading: isLoadingProp,
  maxWidth,
  onSelectedChange,
  onPress,
  onDismiss,
  // dismissLabel is destructured to keep it out of `...rest` (it would
  // otherwise be applied to the root element as an unknown HTML attribute).
  // The single-focus chip model exposes the removal action via the chip's
  // own aria-label rather than via a separately-labelled inner button.
  dismissLabel: _dismissLabel,
  hasDrag = false,
  dragHandleProps,
  className,
  onClick,
  onKeyDown,
  style,
  tabIndex: tabIndexProp,
  "aria-label": ariaLabelProp,
  ...rest
}, ref) {
  const ctx = ChipListContext.useChipList();
  const variant = variantProp ?? (ctx == null ? void 0 : ctx.variant) ?? "general";
  const appearance = appearanceProp ?? (ctx == null ? void 0 : ctx.appearance) ?? "primary";
  const size = sizeProp ?? (ctx == null ? void 0 : ctx.size) ?? "md";
  const colorMode = colorModeProp ?? (ctx == null ? void 0 : ctx.colorMode) ?? "default";
  const isDisabled = isDisabledProp ?? (ctx == null ? void 0 : ctx.isDisabled) ?? false;
  const isReadOnly = isReadOnlyProp ?? (ctx == null ? void 0 : ctx.isReadOnly) ?? false;
  const isLoading = isLoadingProp ?? (ctx == null ? void 0 : ctx.isLoading) ?? false;
  const isFilter = variant === "filter";
  const [isSelected, setSelected] = useControllableState.useControllableState(
    isFilter ? selectedProp : void 0,
    defaultSelected
  );
  const blocked = isDisabled || isReadOnly || isLoading;
  const isActionableGeneral = variant === "general" && !!onPress;
  const isInteractive = isFilter || isActionableGeneral;
  const isDismissibleInput = variant === "input" && !!onDismiss && !blocked;
  const isSemantic = colorMode === "semantic";
  const allowValidation = !isSemantic;
  const showInvalid = isInvalid && allowValidation;
  const showWarning = isWarning && allowValidation && !showInvalid;
  const showExcluded = isExcluded && allowValidation;
  const showGrip = (!!dragHandleProps || hasDrag) && !blocked;
  const showAvatar = !!avatar && !isSemantic;
  const showStatus = !!status && !isSemantic;
  const effectiveAppearance = colorMode === "custom" ? "utility" : appearance;
  const showAlert = showInvalid || showWarning;
  const hasValidation = showAlert && !!validationMessage;
  const focusableForValidation = variant === "general" && !onPress && hasValidation && !blocked;
  const showDismiss = !!onDismiss && variant === "input" && !isDisabled && !isReadOnly && !isLoading;
  const colorClass = resolveColorClass(colorMode, effectiveAppearance, semanticType, customColor);
  const rootElRef = React.useRef(null);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const classes = [
    "arvo-chip",
    `arvo-chip--${variant}`,
    `arvo-chip--${size}`,
    `arvo-chip--${effectiveAppearance}`,
    colorClass,
    isFilter && isSelected ? "active" : "",
    isDisabled ? "is-disabled" : "",
    isReadOnly ? "is-readonly" : "",
    showInvalid ? "is-invalid" : "",
    showWarning ? "is-warning" : "",
    showExcluded ? "is-excluded" : "",
    isLoading ? "loading" : "",
    // While the leave animation is running we keep the chip mounted and
    // toggle this modifier to drive the shrink + fade transition. The
    // chip is no longer interactive in this state.
    // We define this state separately from any of the above flags because
    // it can layer on top of any combination (e.g. an .active filter chip
    // being removed from a multi-chip selection list).
    isRemoving ? "is-removing" : "",
    className ?? ""
  ].filter(Boolean).join(" ");
  const rootStyle = maxWidth ? { ...style, ["--arvo-chip-max-width"]: maxWidth } : style;
  const labelRef = React.useRef(null);
  const isTruncated = useTruncationOverflow(labelRef);
  const truncationText = title ? `${title}: ${label}` : label;
  const resolvedTooltip = tooltip ? tooltip : hasValidation ? validationMessage : isTruncated && !blocked ? truncationText : null;
  const generatedId = React.useId();
  const validationDescId = hasValidation ? `${generatedId}-validation` : void 0;
  const beginRemove = () => {
    if (isRemoving) return;
    setIsRemoving(true);
    const el = rootElRef.current;
    const finish = () => {
      onDismiss == null ? void 0 : onDismiss();
    };
    if (!el) {
      finish();
      return;
    }
    let settled = false;
    const onEnd = (event) => {
      if (event.target !== el || settled) return;
      if (event.propertyName !== "max-width") return;
      settled = true;
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
      finish();
    };
    el.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      el.removeEventListener("transitionend", onEnd);
      finish();
    }, 500);
  };
  const handleClick = (e) => {
    if (blocked) {
      e.preventDefault();
      return;
    }
    if (isFilter) {
      const next = !isSelected;
      setSelected(next);
      onSelectedChange == null ? void 0 : onSelectedChange(next);
    } else if (isActionableGeneral && onPress) {
      onPress();
    }
    onClick == null ? void 0 : onClick(e);
  };
  const handleKeyDown = (e) => {
    onKeyDown == null ? void 0 : onKeyDown(e);
    if (e.defaultPrevented) return;
    if (blocked) return;
    if (isDismissibleInput && (e.key === "Delete" || e.key === "Backspace")) {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        e.stopPropagation();
        beginRemove();
      }
    }
  };
  const gripLabel = typeof (dragHandleProps == null ? void 0 : dragHandleProps["aria-label"]) === "string" && dragHandleProps["aria-label"] || "Drag to reorder";
  const resolvedAriaLabel = ariaLabelProp ?? (isDismissibleInput ? `${label}. Press Delete or Backspace to remove.` : void 0);
  const content = /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    showGrip && /* @__PURE__ */ jsxRuntime.jsx(
      IconButton.ArvoIconButton,
      {
        ...dragHandleProps,
        className: ["arvo-chip__grip", dragHandleProps == null ? void 0 : dragHandleProps.className].filter(Boolean).join(" "),
        icon: "drag-handle",
        variant: "tertiary",
        size: "xs",
        tooltip: gripLabel,
        isDisabled
      }
    ),
    icon && /* @__PURE__ */ jsxRuntime.jsx("i", { className: `arvo-chip__ico o9con o9con-${icon}`, "aria-hidden": "true" }),
    showAvatar && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-chip__avatar", children: avatar }),
    title && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-chip__title", children: title }),
    /* @__PURE__ */ jsxRuntime.jsx("span", { ref: labelRef, className: "arvo-chip__lbl", children: label }),
    typeof counter === "number" ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-chip__counter", children: /* @__PURE__ */ jsxRuntime.jsx(
      Badge.ArvoBadge,
      {
        variant: "counter",
        appearance: "filled",
        colorMode: colorMode === "custom" ? "custom" : "semantic",
        semanticType: colorMode === "semantic" && semanticType !== "none" ? semanticType : "neutral",
        customColor,
        size: "sm",
        count: counter,
        hideWhenZero: false,
        hasBadgeIcon: false
      }
    ) }) : counter ? /* @__PURE__ */ jsxRuntime.jsx("span", { className: "arvo-chip__counter", children: counter }) : null,
    showAlert && /* @__PURE__ */ jsxRuntime.jsx(
      MessageAlert.ArvoMessageAlert,
      {
        className: "arvo-chip__alert",
        isInline: true,
        type: showInvalid ? "negative" : "warning"
      }
    ),
    showExcluded && /* @__PURE__ */ jsxRuntime.jsx("i", { className: "arvo-chip__exclude o9con o9con-exclude", "aria-hidden": "true" }),
    showDismiss && // Single-focus chip model: the chip itself is the focusable surface
    // and Delete/Backspace removes it. The X is a NON-INTERACTIVE visual
    // affordance for mouse/touch users -- rendered as a plain span (no
    // role, no tabindex) so it is never a separate tab stop AND does not
    // trigger axe's `nested-interactive` rule. The chip's aria-label
    // already announces the removal action.
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        className: "arvo-chip__dismiss",
        "aria-hidden": "true",
        onClick: (e) => {
          e.stopPropagation();
          beginRemove();
        },
        children: /* @__PURE__ */ jsxRuntime.jsx(
          "i",
          {
            className: "arvo-chip__dismiss-icon o9con o9con-close",
            "aria-hidden": "true"
          }
        )
      }
    ),
    showStatus && status && /* @__PURE__ */ jsxRuntime.jsx(
      Status.ArvoStatus,
      {
        ...status,
        className: "arvo-chip__status",
        size: status.size ?? (size === "lg" ? "md" : "sm"),
        placement: status.placement ?? "top-right"
      }
    ),
    hasValidation && /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        id: validationDescId,
        className: "arvo-chip__sr-only",
        style: SR_ONLY_STYLE,
        children: validationMessage
      }
    )
  ] });
  const setRootRef = (node) => {
    rootElRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  let rootElement;
  if (isInteractive) {
    rootElement = /* @__PURE__ */ jsxRuntime.jsx(
      "button",
      {
        ...rest,
        ref: setRootRef,
        type: "button",
        className: classes,
        style: rootStyle,
        disabled: isDisabled,
        tabIndex: tabIndexProp,
        "aria-label": resolvedAriaLabel,
        "aria-pressed": isFilter ? isSelected : void 0,
        "aria-readonly": isReadOnly || void 0,
        "aria-invalid": showInvalid || void 0,
        "aria-busy": isLoading || void 0,
        "aria-describedby": validationDescId,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        children: content
      }
    );
  } else {
    const isInputButton = isDismissibleInput;
    const inheritedTabIndex = tabIndexProp ?? (isInputButton || focusableForValidation ? 0 : void 0);
    const role = isInputButton ? "button" : variant === "input" ? "group" : void 0;
    rootElement = /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        ...rest,
        ref: setRootRef,
        className: classes,
        style: rootStyle,
        role,
        tabIndex: inheritedTabIndex,
        "aria-label": resolvedAriaLabel,
        "aria-disabled": isDisabled || void 0,
        "aria-readonly": isReadOnly || void 0,
        "aria-invalid": showInvalid || void 0,
        "aria-busy": isLoading || void 0,
        "aria-describedby": validationDescId,
        onClick: (e) => {
          if (blocked) return;
          onClick == null ? void 0 : onClick(e);
        },
        onKeyDown: handleKeyDown,
        children: content
      }
    );
  }
  return resolvedTooltip ? /* @__PURE__ */ jsxRuntime.jsx(Tooltip.ArvoTooltip, { content: resolvedTooltip, children: rootElement }) : rootElement;
});
const SR_ONLY_STYLE = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0
};
exports.ArvoChip = ArvoChip;
exports.default = ArvoChip;
//# sourceMappingURL=index46.cjs.map
