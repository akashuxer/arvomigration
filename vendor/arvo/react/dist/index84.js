import { jsx } from "react/jsx-runtime";
import { forwardRef, useId, useMemo, useState, useRef, useCallback, useImperativeHandle, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUserLocale, getLocaleTimeFormat, formatTime, parseTime } from "@arvo/core";
import { useOverlaySurface } from "./index92.js";
import { ArvoTimeDropdown } from "./index83.js";
function normalizeTime(v) {
  const hours = Math.trunc(v.hours);
  const minutes = Math.trunc(v.minutes);
  const seconds = v.seconds == null ? void 0 : Math.trunc(v.seconds);
  const milliseconds = v.milliseconds == null ? void 0 : Math.trunc(v.milliseconds);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  if (seconds != null && (seconds < 0 || seconds > 59)) return null;
  if (milliseconds != null && (milliseconds < 0 || milliseconds > 999)) return null;
  const out = { hours, minutes };
  if (seconds != null) out.seconds = seconds;
  if (milliseconds != null) out.milliseconds = milliseconds;
  if (v.timezone != null) out.timezone = v.timezone;
  return out;
}
function timeFromDate(date) {
  if (Number.isNaN(date.getTime())) return null;
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds()
  };
}
function coerceTime(v, format) {
  if (v == null) return null;
  if (v instanceof Date) return timeFromDate(v);
  if (typeof v === "string") return v.length === 0 ? null : parseTime(v, format);
  return normalizeTime(v);
}
function asTime(v, format) {
  if (v == null) return null;
  if (typeof v === "string") return v.length === 0 ? null : parseTime(v, format);
  return normalizeTime(v);
}
function totalMs(v) {
  return ((v.hours * 60 + v.minutes) * 60 + (v.seconds ?? 0)) * 1e3 + (v.milliseconds ?? 0);
}
function clampToRange(v, min, max) {
  if (!v) return null;
  if (min && totalMs(v) < totalMs(min)) return { ...min };
  if (max && totalMs(v) > totalMs(max)) return { ...max };
  return v;
}
function timeKey(v) {
  if (!v) return "null";
  return `${v.hours}:${v.minutes}:${v.seconds ?? 0}.${v.milliseconds ?? 0}`;
}
const ArvoTimePickerDropdown = forwardRef(function ArvoTimePickerDropdown2({
  triggerRef,
  value,
  defaultValue,
  format,
  locale,
  interval = 15,
  minTime,
  maxTime,
  isOpen: isOpenProp,
  defaultOpen = false,
  isDisabled = false,
  isAutoClose = true,
  placement = "bottom-end",
  ariaLabel = "Choose a time",
  popoverProps,
  onChange,
  onOpen,
  onClose,
  onOpenChange,
  className,
  id
}, ref) {
  const uid = useId();
  const dropdownId = id ?? `arvo-tp-drop-${uid.replace(/[:]/g, "")}`;
  const popoverId = `${dropdownId}-popover`;
  const effLocale = locale ?? getUserLocale();
  const effFormat = format ?? getLocaleTimeFormat(effLocale);
  const minResolved = asTime(minTime, effFormat);
  const maxResolved = asTime(maxTime, effFormat);
  const isControlled = value !== void 0;
  const initialValue = useMemo(() => {
    const raw = value !== void 0 ? value : defaultValue ?? null;
    return clampToRange(coerceTime(raw, effFormat), minResolved, maxResolved);
  }, []);
  const [internalValue, setInternalValue] = useState(initialValue);
  const committedValue = isControlled ? clampToRange(coerceTime(value ?? null, effFormat), minResolved, maxResolved) : internalValue;
  const [disabledOverride, setDisabledOverride] = useState(null);
  const effDisabled = disabledOverride ?? isDisabled;
  const popoverRef = useRef(null);
  const dispatchTrigger = useCallback(
    (name, detail = {}) => {
      const el = triggerRef.current;
      if (!el) return true;
      const ev = new CustomEvent(name, { bubbles: true, cancelable: true, detail });
      return el.dispatchEvent(ev);
    },
    [triggerRef]
  );
  const getOrderedPopoverElements = useCallback(() => {
    const root = popoverRef.current;
    if (!root) return [];
    return [root.querySelector('[tabindex="0"]')];
  }, []);
  const handleEngineClose = useCallback(() => {
  }, []);
  const surface = useOverlaySurface({
    type: "dropdown",
    priority: 20,
    zIndex: popoverProps == null ? void 0 : popoverProps.zIndex,
    triggerRef,
    panelRef: popoverRef,
    isOpen: isOpenProp,
    defaultOpen,
    onOpenChange,
    placement,
    gap: (popoverProps == null ? void 0 : popoverProps.offset) ?? 4,
    focus: "trap",
    initialFocus: "none",
    getOrderedElements: getOrderedPopoverElements,
    returnFocus: true,
    closeOnOutside: true,
    closeOnEscape: true,
    transition: "fade",
    transitionDuration: 150,
    haspopup: "dialog",
    controlsId: popoverId,
    emitStyle: true,
    onClose: handleEngineClose
  });
  const {
    isOpen,
    isMounted,
    positioned,
    panelStyle,
    panelSide,
    open: openSurface,
    close: closeSurface,
    setOpen: setSurfaceOpen
  } = surface;
  const handleProgrammaticOpen = useCallback(() => {
    if (effDisabled) return;
    if (isOpen) return;
    if ((onOpen == null ? void 0 : onOpen()) === false) return;
    if (!dispatchTrigger("tp-drop:open")) return;
    openSurface();
  }, [effDisabled, isOpen, onOpen, dispatchTrigger, openSurface]);
  const handleProgrammaticClose = useCallback(() => {
    if (!isOpen) return;
    if ((onClose == null ? void 0 : onClose()) === false) return;
    if (!dispatchTrigger("tp-drop:close")) return;
    closeSurface();
  }, [isOpen, onClose, dispatchTrigger, closeSurface]);
  const handleDropdownChange = useCallback(
    (time) => {
      const clamped = clampToRange(time, minResolved, maxResolved);
      if (!isControlled) setInternalValue(clamped);
      const formatted = clamped ? formatTime(clamped, effFormat) : "";
      onChange == null ? void 0 : onChange({ value: clamped, formattedValue: formatted });
      dispatchTrigger("tp-drop:change", { value: clamped, formattedValue: formatted });
      if (isAutoClose) handleProgrammaticClose();
    },
    [minResolved, maxResolved, isControlled, effFormat, onChange, dispatchTrigger, isAutoClose, handleProgrammaticClose]
  );
  useImperativeHandle(
    ref,
    () => {
      const valueAccessor = ((newValue) => {
        if (newValue === void 0) return committedValue;
        const coerced = clampToRange(
          coerceTime(newValue, effFormat),
          minResolved,
          maxResolved
        );
        if (!isControlled) setInternalValue(coerced);
        return void 0;
      });
      const disabledAccessor = ((next) => {
        if (next === void 0) return effDisabled;
        setDisabledOverride(next);
        if (next && isOpen) closeSurface();
        return void 0;
      });
      return {
        open: handleProgrammaticOpen,
        close: handleProgrammaticClose,
        toggle: (force) => {
          const next = force === void 0 ? !isOpen : force;
          if (next) handleProgrammaticOpen();
          else handleProgrammaticClose();
        },
        isOpen: () => isOpen,
        value: valueAccessor,
        formattedValue: () => committedValue ? formatTime(committedValue, effFormat) : "",
        disabled: disabledAccessor,
        focus: () => {
          var _a, _b;
          if (!isOpen) return;
          (_b = (_a = popoverRef.current) == null ? void 0 : _a.querySelector('[tabindex="0"]')) == null ? void 0 : _b.focus({
            preventScroll: true
          });
        },
        destroy: () => {
          if (isOpen) setSurfaceOpen(false);
        }
      };
    },
    [
      handleProgrammaticOpen,
      handleProgrammaticClose,
      isOpen,
      committedValue,
      effDisabled,
      effFormat,
      minResolved,
      maxResolved,
      isControlled,
      closeSurface,
      setSurfaceOpen
    ]
  );
  useEffect(() => {
    if (!isOpen || !positioned) return;
    requestAnimationFrame(() => {
      var _a, _b;
      (_b = (_a = popoverRef.current) == null ? void 0 : _a.querySelector('[tabindex="0"]')) == null ? void 0 : _b.focus({
        preventScroll: true
      });
    });
  }, [isOpen, positioned]);
  const isOpenRef = useRef(false);
  isOpenRef.current = isOpen;
  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const handleClick = (e) => {
      if (e.defaultPrevented) return;
      if (isOpenRef.current) handleProgrammaticClose();
      else handleProgrammaticOpen();
    };
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpenRef.current) handleProgrammaticOpen();
        return;
      }
      if (e.altKey && e.key === "ArrowUp") {
        e.preventDefault();
        if (isOpenRef.current) handleProgrammaticClose();
        return;
      }
      if (e.key === "Escape") {
        if (isOpenRef.current) {
          e.preventDefault();
          handleProgrammaticClose();
        }
        return;
      }
    };
    el.addEventListener("click", handleClick);
    el.addEventListener("keydown", handleKeyDown);
    return () => {
      el.removeEventListener("click", handleClick);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [triggerRef, handleProgrammaticOpen, handleProgrammaticClose]);
  const popoverStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    margin: 0,
    ...(popoverProps == null ? void 0 : popoverProps.width) ? { width: popoverProps.width } : {},
    ...panelStyle ?? {}
  };
  const dropdownKey = timeKey(committedValue);
  if (!isMounted) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: popoverRef,
        id: popoverId,
        className: ["arvo-tp-drop", className].filter(Boolean).join(" "),
        role: "dialog",
        "aria-label": ariaLabel,
        "aria-modal": false,
        "data-arvo-side": panelSide,
        style: popoverStyle,
        children: /* @__PURE__ */ jsx("div", { className: "arvo-tp-drop__body", children: /* @__PURE__ */ jsx(
          ArvoTimeDropdown,
          {
            value: committedValue,
            format: effFormat,
            locale: effLocale,
            interval,
            minTime: minResolved,
            maxTime: maxResolved,
            isDisabled: effDisabled,
            onChange: handleDropdownChange,
            onDismiss: handleProgrammaticClose
          },
          dropdownKey
        ) })
      }
    ),
    document.body
  );
});
export {
  ArvoTimePickerDropdown,
  ArvoTimePickerDropdown as default
};
//# sourceMappingURL=index84.js.map
