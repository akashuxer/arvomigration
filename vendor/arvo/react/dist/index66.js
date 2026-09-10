import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useEffect, useCallback, useImperativeHandle } from "react";
import { useControllableState } from "./index90.js";
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
function resolveTarget(target) {
  if (!target) return null;
  if (typeof target === "string") {
    if (typeof document === "undefined") return null;
    return document.querySelector(target);
  }
  if (target instanceof HTMLElement) return target;
  if (typeof target === "object" && "current" in target) {
    return target.current ?? null;
  }
  return null;
}
function detectInverse(splitter, target) {
  const pos = splitter.compareDocumentPosition(target);
  return Boolean(pos & 4);
}
function measureTarget(target, orientation) {
  const rect = target.getBoundingClientRect();
  return orientation === "vertical" ? rect.width : rect.height;
}
function applyTargetSize(target, size, orientation) {
  const prop = orientation === "vertical" ? "width" : "height";
  target.style[prop] = `${size}px`;
}
const ArvoSplitter = forwardRef(
  function ArvoSplitter2({
    orientation = "vertical",
    isResizable = true,
    target,
    inverse: inverseProp,
    value: valueProp,
    defaultValue,
    minSize = 0,
    maxSize,
    step = 16,
    pageStep = 64,
    isDisabled = false,
    ariaLabel,
    ariaControls: ariaControlsProp,
    onResizeStart,
    onResize,
    onResizeEnd,
    onChange,
    onReset,
    className,
    onKeyDown,
    onPointerDown,
    onDoubleClick,
    ...rest
  }, forwardedRef) {
    const rootRef = useRef(null);
    const effectiveMax = typeof maxSize === "number" ? maxSize : Number.MAX_SAFE_INTEGER;
    const resetTargetRef = useRef(
      typeof defaultValue === "number" ? defaultValue : minSize
    );
    const targetElRef = useRef(null);
    const [autoInverse, setAutoInverse] = useState(false);
    const inverse = inverseProp ?? autoInverse;
    const [resolvedTargetEl, setResolvedTargetEl] = useState(
      () => resolveTarget(target ?? null)
    );
    useEffect(() => {
      const live = resolveTarget(target ?? null);
      setResolvedTargetEl((prev) => live !== prev ? live : prev);
    });
    const initialValue = typeof valueProp === "number" ? clamp(valueProp, minSize, effectiveMax) : typeof defaultValue === "number" ? clamp(defaultValue, minSize, effectiveMax) : clamp(minSize, minSize, effectiveMax);
    const [currentValue, setCurrentValue] = useControllableState(
      valueProp,
      initialValue
    );
    const [isActive, setIsActive] = useState(false);
    const latest = useRef({
      orientation,
      inverse,
      minSize,
      maxSize: effectiveMax,
      currentValue,
      onResize,
      onResizeEnd,
      onChange,
      onReset,
      isDisabled,
      isResizable
    });
    latest.current = {
      orientation,
      inverse,
      minSize,
      maxSize: effectiveMax,
      currentValue,
      onResize,
      onResizeEnd,
      onChange,
      onReset,
      isDisabled,
      isResizable
    };
    useEffect(() => {
      targetElRef.current = resolvedTargetEl;
      const splitterEl = rootRef.current;
      if (resolvedTargetEl && splitterEl) {
        setAutoInverse(detectInverse(splitterEl, resolvedTargetEl));
        if (typeof defaultValue !== "number") {
          const measured = measureTarget(resolvedTargetEl, orientation);
          if (measured > 0) {
            resetTargetRef.current = clamp(measured, minSize, effectiveMax);
            if (typeof valueProp !== "number") {
              setCurrentValue(resetTargetRef.current);
            }
          }
        }
      } else {
        setAutoInverse(false);
      }
    }, [resolvedTargetEl]);
    useEffect(() => {
      if (typeof defaultValue === "number") {
        resetTargetRef.current = clamp(defaultValue, minSize, effectiveMax);
      }
    }, [defaultValue, minSize, effectiveMax]);
    useEffect(() => {
      const el = targetElRef.current;
      if (el) applyTargetSize(el, currentValue, orientation);
    }, [currentValue, orientation, resolvedTargetEl]);
    useEffect(() => {
      const clamped = clamp(currentValue, minSize, effectiveMax);
      if (clamped !== currentValue) {
        setCurrentValue(clamped);
      }
    }, [minSize, effectiveMax, currentValue, setCurrentValue]);
    const emitResize = useCallback(
      (next, reason) => {
        var _a, _b, _c, _d;
        const clamped = clamp(
          next,
          latest.current.minSize,
          latest.current.maxSize
        );
        if (clamped === latest.current.currentValue) return clamped;
        setCurrentValue(clamped);
        (_b = (_a = latest.current).onResize) == null ? void 0 : _b.call(_a, clamped, reason);
        (_d = (_c = latest.current).onChange) == null ? void 0 : _d.call(_c, clamped);
        return clamped;
      },
      [setCurrentValue]
    );
    const handlePointerDown = useCallback(
      (event) => {
        onPointerDown == null ? void 0 : onPointerDown(event);
        if (event.defaultPrevented) return;
        if (!latest.current.isResizable) return;
        if (latest.current.isDisabled) return;
        if (event.button !== 0) return;
        event.preventDefault();
        const rail = rootRef.current;
        if (!rail) return;
        const startX = event.clientX;
        const startY = event.clientY;
        const startValue = latest.current.currentValue;
        setIsActive(true);
        rail.focus();
        onResizeStart == null ? void 0 : onResizeStart(startValue, "pointer");
        const handlePointerMove = (ev) => {
          const isVertical = latest.current.orientation === "vertical";
          const rawDelta = isVertical ? ev.clientX - startX : ev.clientY - startY;
          const signedDelta = latest.current.inverse ? -rawDelta : rawDelta;
          emitResize(startValue + signedDelta, "pointer");
        };
        const handlePointerUp = () => {
          var _a, _b;
          window.removeEventListener("pointermove", handlePointerMove);
          window.removeEventListener("pointerup", handlePointerUp);
          window.removeEventListener("pointercancel", handlePointerUp);
          setIsActive(false);
          const finalValue = latest.current.currentValue;
          (_b = (_a = latest.current).onResizeEnd) == null ? void 0 : _b.call(_a, finalValue, "pointer");
        };
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
      },
      [emitResize, onPointerDown, onResizeStart]
    );
    const handleKeyDown = useCallback(
      (event) => {
        var _a, _b;
        onKeyDown == null ? void 0 : onKeyDown(event);
        if (event.defaultPrevented) return;
        if (!latest.current.isResizable) return;
        if (latest.current.isDisabled) return;
        const isVertical = latest.current.orientation === "vertical";
        const decreaseKey = isVertical ? "ArrowLeft" : "ArrowUp";
        const increaseKey = isVertical ? "ArrowRight" : "ArrowDown";
        const startValue = latest.current.currentValue;
        let delta = 0;
        let snap = null;
        switch (event.key) {
          case decreaseKey:
            delta = -step;
            break;
          case increaseKey:
            delta = step;
            break;
          case "PageUp":
            delta = -pageStep;
            break;
          case "PageDown":
            delta = pageStep;
            break;
          case "Home":
            snap = latest.current.minSize;
            break;
          case "End":
            snap = latest.current.maxSize;
            break;
          default:
            return;
        }
        event.preventDefault();
        onResizeStart == null ? void 0 : onResizeStart(startValue, "keyboard");
        const target2 = snap !== null ? snap : startValue + delta;
        const finalValue = emitResize(target2, "keyboard");
        (_b = (_a = latest.current).onResizeEnd) == null ? void 0 : _b.call(_a, finalValue, "keyboard");
      },
      [emitResize, onKeyDown, onResizeStart, pageStep, step]
    );
    const doReset = useCallback(() => {
      var _a, _b, _c, _d;
      const next = clamp(
        resetTargetRef.current,
        latest.current.minSize,
        latest.current.maxSize
      );
      onResizeStart == null ? void 0 : onResizeStart(latest.current.currentValue, "reset");
      if (next !== latest.current.currentValue) {
        emitResize(next, "reset");
      }
      (_b = (_a = latest.current).onResizeEnd) == null ? void 0 : _b.call(_a, next, "reset");
      (_d = (_c = latest.current).onReset) == null ? void 0 : _d.call(_c, next);
      return next;
    }, [emitResize, onResizeStart]);
    const handleDoubleClick = useCallback(
      (event) => {
        onDoubleClick == null ? void 0 : onDoubleClick(event);
        if (event.defaultPrevented) return;
        if (!latest.current.isResizable) return;
        if (latest.current.isDisabled) return;
        event.preventDefault();
        doReset();
      },
      [doReset, onDoubleClick]
    );
    useImperativeHandle(
      forwardedRef,
      () => ({
        value(next) {
          var _a, _b;
          if (typeof next === "number") {
            onResizeStart == null ? void 0 : onResizeStart(latest.current.currentValue, "programmatic");
            const final = emitResize(next, "programmatic");
            (_b = (_a = latest.current).onResizeEnd) == null ? void 0 : _b.call(_a, final, "programmatic");
          }
          return latest.current.currentValue;
        },
        disabled(next) {
          return latest.current.isDisabled;
        },
        focus() {
          var _a;
          if (!latest.current.isResizable) return;
          (_a = rootRef.current) == null ? void 0 : _a.focus();
        },
        reset() {
          return doReset();
        }
      }),
      [doReset, emitResize, onResizeStart]
    );
    const ariaControls = ariaControlsProp ?? ((resolvedTargetEl == null ? void 0 : resolvedTargetEl.id) ? resolvedTargetEl.id : void 0);
    const classes = [
      "arvo-spl",
      `arvo-spl--${orientation}`,
      isResizable ? "arvo-spl--resizable" : "",
      inverse ? "arvo-spl--inverse" : "",
      isActive ? "active" : "",
      isResizable && isDisabled ? "arvo-spl--disabled is-disabled" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const ariaProps = isResizable ? {
      "aria-valuemin": minSize,
      "aria-valuemax": typeof maxSize === "number" ? maxSize : void 0,
      "aria-valuenow": currentValue,
      "aria-label": ariaLabel,
      "aria-controls": ariaControls,
      "aria-disabled": isDisabled || void 0,
      tabIndex: isDisabled ? -1 : 0
    } : {};
    return /* @__PURE__ */ jsx(
      "div",
      {
        ...rest,
        ref: rootRef,
        role: "separator",
        "aria-orientation": orientation,
        ...ariaProps,
        className: classes,
        onPointerDown: isResizable ? handlePointerDown : onPointerDown,
        onKeyDown: isResizable ? handleKeyDown : onKeyDown,
        onDoubleClick: isResizable ? handleDoubleClick : onDoubleClick,
        children: isResizable && /* @__PURE__ */ jsx("span", { className: "arvo-spl__handle", "aria-hidden": "true" })
      }
    );
  }
);
export {
  ArvoSplitter as default
};
//# sourceMappingURL=index66.js.map
