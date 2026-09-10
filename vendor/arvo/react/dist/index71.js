import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useImperativeHandle, useCallback, useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { resolveOverlayInitialFocus } from "@arvo/core";
import { ArvoButton } from "./index16.js";
import { ArvoIconButton } from "./index17.js";
import ArvoCheckbox from "./index23.js";
import ArvoTextbox from "./index19.js";
import ArvoTextarea from "./index20.js";
import { ArvoCombobox } from "./index55.js";
import { ArvoSelect } from "./index53.js";
import { ArvoBannerAlert } from "./index48.js";
import { renderInlineContentReact } from "./index89.js";
import { useOverlaySurface } from "./index92.js";
import { attachOverlayFooterFit } from "@arvo/utils";
const DEFAULT_PRIMARY = { label: "OK" };
const DEFAULT_SECONDARY = { label: "Cancel" };
function normalizeDontShow(value) {
  if (value === null || value === void 0 || value === false) return null;
  if (value === true) return {};
  return value;
}
const ArvoAlertDialog = forwardRef(
  function ArvoAlertDialog2({
    variant = "warning",
    title,
    message,
    content,
    bannerAlert,
    isOpen: openProp,
    defaultOpen = false,
    hasDangerAction = false,
    primaryAction = DEFAULT_PRIMARY,
    secondaryAction,
    hasSecondaryBtn = true,
    hasPrimaryBtn = true,
    isClosable = false,
    hasBackdrop = true,
    closeOnBackdrop = false,
    closeOnEscape = true,
    confirmInput = null,
    dontShowAgain = null,
    isLoading: isLoadingProp = false,
    isDisabled = false,
    container = null,
    initialFocus = "auto",
    className,
    onOpenChange,
    onOpen,
    onClose,
    onConfirmInputChange,
    onDontShowAgainChange
  }, ref) {
    var _a, _b;
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const titleId = `arvo-alert-dlg-title-${uid}`;
    const bodyId = `arvo-alert-dlg-body-${uid}`;
    const rootRef = useRef(null);
    const panelRef = useRef(null);
    const footerActionsRef = useRef(null);
    const triggerRef = useRef(null);
    useImperativeHandle(ref, () => rootRef.current, []);
    const closingProgrammaticallyRef = useRef(false);
    const handleEngineClose = useCallback(() => {
      if (closingProgrammaticallyRef.current) return;
    }, []);
    const handleEngineOpen = useCallback(() => {
      if ((onOpen == null ? void 0 : onOpen()) === false) return false;
    }, [onOpen]);
    const surface = useOverlaySurface({
      type: "modal",
      priority: 10,
      triggerRef,
      panelRef,
      // Pin the outer host's stacking context to the panel's hub-assigned
      // z-index so consumer-level zIndexBase tuning lifts the WHOLE dialog
      // above sibling overlays -- not just the inner panel inside a wrapper
      // trapped at the SCSS fallback layer.
      wrapperRef: rootRef,
      isOpen: openProp,
      defaultOpen,
      onOpenChange,
      onOpen: handleEngineOpen,
      onClose: handleEngineClose,
      positioned: false,
      focus: "trap",
      initialFocus: initialFocus === "none" ? "none" : () => {
        var _a2;
        const panel = panelRef.current;
        const footerButtons = Array.from(
          ((_a2 = footerActionsRef.current) == null ? void 0 : _a2.querySelectorAll("button")) ?? []
        );
        const secondaryButton = footerButtons[0] ?? null;
        const primaryButton = footerButtons[footerButtons.length - 1] ?? null;
        if (initialFocus === "auto") {
          const preferSecondary = variant === "warning" || variant === "negative" || variant === "block";
          return preferSecondary ? secondaryButton ?? primaryButton : primaryButton ?? secondaryButton;
        }
        return resolveOverlayInitialFocus({
          initialFocus,
          root: panel,
          body: (panel == null ? void 0 : panel.querySelector(".arvo-alert-dlg__body")) ?? null,
          footer: (panel == null ? void 0 : panel.querySelector(".arvo-alert-dlg__footer")) ?? null,
          header: (panel == null ? void 0 : panel.querySelector(".arvo-alert-dlg__header")) ?? null
        });
      },
      returnFocus: true,
      transition: "scale",
      transitionDuration: 150,
      closeOnEscape,
      closeOnOutside: closeOnBackdrop,
      mask: hasBackdrop ? { className: "arvo-alert-dlg__overlay-mask", closeOnClick: closeOnBackdrop } : void 0,
      managesOwnBackdrop: true,
      lockScroll: false,
      triggerAria: false,
      emitStyle: false
    });
    const isOpen = surface.isOpen;
    const confirmInputType = (confirmInput == null ? void 0 : confirmInput.type) ?? "textbox";
    const isMultiSelect = confirmInputType === "multi-select";
    const [confirmValue, setConfirmValue] = useState("");
    const [confirmValues, setConfirmValues] = useState([]);
    const [confirmError, setConfirmError] = useState(null);
    const validationResult = useMemo(() => {
      if (!confirmInput) return { blocked: false, error: null };
      const value = isMultiSelect ? confirmValues : confirmValue;
      if (isMultiSelect) {
        const expected = confirmInput.expectedValues;
        if (expected) {
          const actual = confirmValues;
          const sameLen = actual.length === expected.length;
          const sameSet = sameLen && expected.every((v) => actual.includes(v));
          if (!sameSet) return { blocked: true, error: null };
        }
      } else {
        const expected = confirmInput.expectedValue;
        if (expected != null && value !== expected) {
          return { blocked: true, error: null };
        }
      }
      const validate = confirmInput.validate;
      if (validate) {
        const r = validate(value);
        if (r === false) return { blocked: true, error: null };
        if (typeof r === "string") return { blocked: true, error: r };
      }
      return { blocked: false, error: null };
    }, [confirmInput, confirmValue, confirmValues, isMultiSelect]);
    useEffect(() => {
      setConfirmError(validationResult.error);
    }, [validationResult.error]);
    const isPrimaryDisabledByConfirm = !!confirmInput && validationResult.blocked;
    useEffect(() => {
      if (!isOpen) {
        setConfirmValue("");
        setConfirmValues([]);
        setConfirmError(null);
      }
    }, [isOpen]);
    const primaryBtnHidden = !hasPrimaryBtn && variant === "warning";
    if (!hasPrimaryBtn && variant !== "warning" && typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a.NODE_ENV) !== "production" && typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn(
        '[ArvoAlertDialog] `hasPrimaryBtn={false}` is only honored when `variant: "warning"`. The primary button will be rendered.'
      );
    }
    const dontShowConfig = normalizeDontShow(dontShowAgain);
    const [dontShowChecked, setDontShowChecked] = useState(
      (dontShowConfig == null ? void 0 : dontShowConfig.defaultChecked) ?? false
    );
    const handleProgrammaticClose = useCallback(
      (reason) => {
        if (!isOpen) return;
        if ((onClose == null ? void 0 : onClose({ reason })) === false) return;
        closingProgrammaticallyRef.current = true;
        surface.close();
        closingProgrammaticallyRef.current = false;
      },
      [isOpen, onClose, surface]
    );
    const runAction = useCallback(
      (action, reason, e) => {
        var _a2;
        const result = (_a2 = action.onClick) == null ? void 0 : _a2.call(action, e);
        if (result === false) return;
        if (action.closeOnClick !== false) {
          handleProgrammaticClose(reason);
        }
      },
      [handleProgrammaticClose]
    );
    const primaryConfig = primaryAction ?? DEFAULT_PRIMARY;
    const secondaryConfig = secondaryAction === null ? null : secondaryAction ?? DEFAULT_SECONDARY;
    const showSecondary = hasSecondaryBtn && secondaryConfig !== null;
    const handlePrimaryClick = useCallback(
      (e) => {
        if (isLoading || isDisabled || primaryConfig.isDisabled || isPrimaryDisabledByConfirm) return;
        runAction(primaryConfig, "primary", e);
      },
      [isLoading, isDisabled, isPrimaryDisabledByConfirm, primaryConfig, runAction]
    );
    const handleSecondaryClick = useCallback(
      (e) => {
        if (!secondaryConfig) return;
        runAction(secondaryConfig, "secondary", e);
      },
      [secondaryConfig, runAction]
    );
    const handleConfirmStringChange = useCallback(
      (next) => {
        setConfirmValue(next);
        const onChange = confirmInput == null ? void 0 : confirmInput.onChange;
        onChange == null ? void 0 : onChange(next);
        onConfirmInputChange == null ? void 0 : onConfirmInputChange(next);
      },
      [confirmInput, onConfirmInputChange]
    );
    const handleConfirmTextboxChange = useCallback(
      (e) => {
        handleConfirmStringChange(e.target.value);
      },
      [handleConfirmStringChange]
    );
    const handleConfirmTextareaChange = useCallback(
      (e) => {
        handleConfirmStringChange(e.target.value);
      },
      [handleConfirmStringChange]
    );
    const handleConfirmInputKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !isPrimaryDisabledByConfirm) {
          if (confirmInputType === "textarea" && e.shiftKey) {
            return;
          }
          e.preventDefault();
          runAction(
            primaryConfig,
            "primary",
            e
          );
        }
      },
      [
        confirmInputType,
        isPrimaryDisabledByConfirm,
        primaryConfig,
        runAction
      ]
    );
    const handleDontShowChange = useCallback(
      (detail) => {
        var _a2;
        const next = detail.isChecked;
        setDontShowChecked(next);
        (_a2 = dontShowConfig == null ? void 0 : dontShowConfig.onChange) == null ? void 0 : _a2.call(dontShowConfig, next);
        onDontShowAgainChange == null ? void 0 : onDontShowAgainChange(next);
      },
      [dontShowConfig, onDontShowAgainChange]
    );
    const primaryLabel = (primaryConfig == null ? void 0 : primaryConfig.label) ?? "";
    const primaryIcon = (primaryConfig == null ? void 0 : primaryConfig.icon) ?? "";
    const secondaryLabel = (secondaryConfig == null ? void 0 : secondaryConfig.label) ?? "";
    const secondaryIcon = (secondaryConfig == null ? void 0 : secondaryConfig.icon) ?? "";
    useEffect(() => {
      if (!surface.isMounted) return;
      const host = footerActionsRef.current;
      if (!host) return;
      const fit = attachOverlayFooterFit(host, { gap: 6 });
      return () => fit.destroy();
    }, [
      surface.isMounted,
      showSecondary,
      primaryBtnHidden,
      primaryLabel,
      primaryIcon,
      secondaryLabel,
      secondaryIcon
    ]);
    const portalTarget = useMemo(() => {
      if (typeof document === "undefined") return null;
      if (!container) return document.body;
      if (typeof container === "string") {
        return document.querySelector(container) ?? document.body;
      }
      return container;
    }, [container]);
    if (!surface.isMounted || !portalTarget) return null;
    const rootClasses = [
      "arvo-alert-dlg",
      `arvo-alert-dlg--${variant}`,
      hasDangerAction && "arvo-alert-dlg--danger",
      isClosable && "arvo-alert-dlg--closable",
      "open",
      isLoading && "loading",
      className
    ].filter(Boolean).join(" ");
    const dontShowLabel = (dontShowConfig == null ? void 0 : dontShowConfig.label) ?? "Don't show this again";
    let confirmInputNode = null;
    if (confirmInput) {
      const baseLabel = confirmInput.label;
      const placeholder = confirmInput.placeholder;
      const isDisabledForInput = isLoading || isDisabled;
      const inputSize = confirmInput.size ?? "lg";
      switch (confirmInput.type) {
        case "textarea": {
          confirmInputNode = /* @__PURE__ */ jsx(
            ArvoTextarea,
            {
              size: inputSize,
              isFullWidth: true,
              label: baseLabel,
              placeholder,
              maxLength: confirmInput.maxLength,
              rows: confirmInput.rows,
              value: confirmValue,
              isDisabled: isDisabledForInput,
              onChange: handleConfirmTextareaChange,
              onKeyDown: handleConfirmInputKeyDown
            }
          );
          break;
        }
        case "combobox": {
          const items = confirmInput.options.map((o) => ({
            id: o.id,
            label: o.label,
            value: o.value ?? o.id
          }));
          confirmInputNode = /* @__PURE__ */ jsx(
            ArvoCombobox,
            {
              size: inputSize,
              isFullWidth: true,
              label: baseLabel,
              placeholder,
              items,
              isDisabled: isDisabledForInput,
              onChange: (item) => handleConfirmStringChange(item ? String(item.value ?? item.id) : "")
            }
          );
          break;
        }
        case "select": {
          const items = confirmInput.options.map((o) => ({
            id: o.id,
            label: o.label,
            value: o.value ?? o.id
          }));
          confirmInputNode = /* @__PURE__ */ jsx(
            ArvoSelect,
            {
              size: inputSize,
              isFullWidth: true,
              label: baseLabel,
              placeholder,
              items,
              isDisabled: isDisabledForInput,
              onChange: (item) => handleConfirmStringChange(item ? String(item.value ?? item.id) : "")
            }
          );
          break;
        }
        case "multi-select": {
          if (typeof process !== "undefined" && ((_b = process.env) == null ? void 0 : _b.NODE_ENV) !== "production" && typeof console !== "undefined" && typeof console.warn === "function") {
            console.warn(
              '[ArvoAlertDialog] confirmInput type "multi-select" is pending until ArvoMultiSelect ships; falling back to combobox single-select.'
            );
          }
          const items = confirmInput.options.map((o) => ({
            id: o.id,
            label: o.label,
            value: o.value ?? o.id
          }));
          confirmInputNode = /* @__PURE__ */ jsx(
            ArvoCombobox,
            {
              size: inputSize,
              isFullWidth: true,
              label: baseLabel,
              placeholder,
              items,
              isDisabled: isDisabledForInput,
              onChange: (item) => {
                var _a2;
                const next = item ? [String(item.value ?? item.id)] : [];
                setConfirmValues(next);
                (_a2 = confirmInput.onChange) == null ? void 0 : _a2.call(confirmInput, next);
                onConfirmInputChange == null ? void 0 : onConfirmInputChange(next);
              }
            }
          );
          break;
        }
        case "textbox":
        default: {
          confirmInputNode = /* @__PURE__ */ jsx(
            ArvoTextbox,
            {
              size: inputSize,
              isFullWidth: true,
              label: baseLabel,
              placeholder,
              maxLength: confirmInput.maxLength,
              value: confirmValue,
              isDisabled: isDisabledForInput,
              onChange: handleConfirmTextboxChange,
              onKeyDown: handleConfirmInputKeyDown
            }
          );
          break;
        }
      }
    }
    return createPortal(
      /* @__PURE__ */ jsx("div", { ref: rootRef, className: rootClasses, children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: panelRef,
          className: "arvo-alert-dlg__panel",
          role: "alertdialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          "aria-describedby": bodyId,
          "aria-busy": isLoading || void 0,
          tabIndex: -1,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "arvo-alert-dlg__header", children: [
              /* @__PURE__ */ jsx("span", { className: "arvo-alert-dlg__ico o9con", "aria-hidden": "true" }),
              /* @__PURE__ */ jsx("p", { id: titleId, className: "arvo-alert-dlg__title", children: title }),
              isClosable && /* @__PURE__ */ jsx("span", { className: "arvo-alert-dlg__close-btn", children: /* @__PURE__ */ jsx(
                ArvoIconButton,
                {
                  icon: "close",
                  variant: "tertiary",
                  size: "sm",
                  tooltip: "Close",
                  "aria-label": "Close dialog",
                  isDisabled: isLoading || isDisabled,
                  onClick: () => handleProgrammaticClose("close-button")
                }
              ) })
            ] }),
            bannerAlert && /* @__PURE__ */ jsx("div", { className: "arvo-alert-dlg__banner", children: /* @__PURE__ */ jsx(ArvoBannerAlert, { ...bannerAlert }) }),
            /* @__PURE__ */ jsxs("div", { id: bodyId, className: "arvo-alert-dlg__body", children: [
              content !== void 0 && content !== null ? content : message && /* @__PURE__ */ jsx("p", { className: "arvo-alert-dlg__msg", children: typeof message === "string" ? message : renderInlineContentReact(message, {
                profile: "basic-inline"
              }) }),
              confirmInputNode && /* @__PURE__ */ jsxs("div", { className: "arvo-alert-dlg__confirm-input", children: [
                confirmInputNode,
                confirmError && /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "arvo-alert-dlg__confirm-error",
                    role: "alert",
                    children: confirmError
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "arvo-alert-dlg__footer", children: [
              dontShowConfig && /* @__PURE__ */ jsx("div", { className: "arvo-alert-dlg__dont-show", children: /* @__PURE__ */ jsx(
                ArvoCheckbox,
                {
                  size: "sm",
                  label: dontShowLabel,
                  isChecked: dontShowChecked,
                  isDisabled: isLoading || isDisabled,
                  onChange: handleDontShowChange
                }
              ) }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: footerActionsRef,
                  className: "arvo-alert-dlg__actions",
                  children: [
                    showSecondary && secondaryConfig && /* @__PURE__ */ jsx(
                      ArvoButton,
                      {
                        label: secondaryConfig.label,
                        icon: secondaryConfig.icon,
                        variant: "secondary",
                        size: "md",
                        isDisabled: isLoading || isDisabled || secondaryConfig.isDisabled,
                        isLoading: secondaryConfig.isLoading,
                        onClick: handleSecondaryClick
                      }
                    ),
                    !primaryBtnHidden && /* @__PURE__ */ jsx(
                      ArvoButton,
                      {
                        label: primaryConfig.label,
                        icon: primaryConfig.icon,
                        variant: hasDangerAction ? "danger" : "primary",
                        size: "md",
                        isDisabled: isLoading || isDisabled || primaryConfig.isDisabled || isPrimaryDisabledByConfirm,
                        isLoading: primaryConfig.isLoading,
                        onClick: handlePrimaryClick
                      }
                    )
                  ]
                }
              )
            ] })
          ]
        }
      ) }),
      portalTarget
    );
  }
);
export {
  ArvoAlertDialog
};
//# sourceMappingURL=index71.js.map
