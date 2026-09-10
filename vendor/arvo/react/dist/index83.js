import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef, useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shouldUse12Hour, getUserLocale, getAmPmStrings, formatTime } from "@arvo/core";
import ArvoButtonGroup from "./index30.js";
function totalMilliseconds(t) {
  return ((t.hours * 60 + t.minutes) * 60 + (t.seconds ?? 0)) * 1e3 + (t.milliseconds ?? 0);
}
function buildOptions(args) {
  const step = Math.max(1, Math.floor(args.interval));
  const min = args.minTime ? totalMilliseconds(args.minTime) : 0;
  const max = args.maxTime ? totalMilliseconds(args.maxTime) : ((23 * 60 + 59) * 60 + 59) * 1e3 + 999;
  const out = [];
  for (let m = 0; m < 24 * 60; m += step) {
    const hours = Math.floor(m / 60);
    const minutes = m % 60;
    const time = { hours, minutes, seconds: 0, milliseconds: 0 };
    const candidate = totalMilliseconds(time);
    if (candidate < min || candidate > max) continue;
    out.push({
      hours,
      minutes,
      key: `${hours}:${minutes}`,
      label: formatTime(time, args.format)
    });
  }
  return out;
}
function pickInitialAmPm(value) {
  if (value) return value.hours < 12 ? "am" : "pm";
  return (/* @__PURE__ */ new Date()).getHours() < 12 ? "am" : "pm";
}
function pickFocusKey(opts, value) {
  if (opts.length === 0) return null;
  if (value) {
    const target = totalMilliseconds(value);
    const exact = opts.find((o) => totalMilliseconds({
      hours: o.hours,
      minutes: o.minutes,
      seconds: 0,
      milliseconds: 0
    }) === target);
    if (exact) return exact.key;
  }
  const now = /* @__PURE__ */ new Date();
  const ref = value ? totalMilliseconds(value) : totalMilliseconds({
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
    milliseconds: now.getMilliseconds()
  });
  let best = opts[0];
  let bestDelta = Math.abs(totalMilliseconds({
    hours: best.hours,
    minutes: best.minutes,
    seconds: 0,
    milliseconds: 0
  }) - ref);
  for (const o of opts) {
    const d = Math.abs(totalMilliseconds({
      hours: o.hours,
      minutes: o.minutes,
      seconds: 0,
      milliseconds: 0
    }) - ref);
    if (d < bestDelta) {
      best = o;
      bestDelta = d;
    }
  }
  return best.key;
}
const ArvoTimeDropdown = forwardRef(
  function ArvoTimeDropdown2({
    value = null,
    format,
    locale,
    interval = 15,
    minTime = null,
    maxTime = null,
    isDisabled = false,
    onChange,
    onDismiss,
    className,
    style,
    id
  }, ref) {
    const use12Hour = useMemo(
      () => shouldUse12Hour({ format, locale }),
      [format, locale]
    );
    const effLocale = useMemo(() => getUserLocale(locale), [locale]);
    const ampmLabels = useMemo(() => getAmPmStrings(effLocale), [effLocale]);
    const allOptions = useMemo(
      () => buildOptions({
        interval,
        format,
        minTime: minTime ?? null,
        maxTime: maxTime ?? null
      }),
      [interval, format, minTime, maxTime]
    );
    const amOptions = useMemo(
      () => allOptions.filter((o) => o.hours < 12),
      [allOptions]
    );
    const pmOptions = useMemo(
      () => allOptions.filter((o) => o.hours >= 12),
      [allOptions]
    );
    const [ampm, setAmPm] = useState(() => pickInitialAmPm(value));
    useEffect(() => {
      if (!use12Hour || !value) return;
      const next = pickInitialAmPm(value);
      if (next === "am" && amOptions.length > 0) setAmPm("am");
      if (next === "pm" && pmOptions.length > 0) setAmPm("pm");
    }, [use12Hour, value, amOptions.length, pmOptions.length]);
    const visibleOptions = use12Hour ? ampm === "am" ? amOptions : pmOptions : allOptions;
    const amTabDisabled = use12Hour && amOptions.length === 0;
    const pmTabDisabled = use12Hour && pmOptions.length === 0;
    const [focusedKey, setFocusedKey] = useState(() => {
      const initialOpts = use12Hour ? pickInitialAmPm(value) === "am" ? amOptions : pmOptions : allOptions;
      return pickFocusKey(initialOpts, value) ?? "";
    });
    const listRef = useRef(null);
    const focusedItemRef = useRef(null);
    useEffect(() => {
      const stillPresent = visibleOptions.some((o) => o.key === focusedKey);
      if (stillPresent) return;
      const next = pickFocusKey(visibleOptions, value);
      if (next != null) setFocusedKey(next);
    }, [visibleOptions, focusedKey, value]);
    useEffect(() => {
      var _a;
      (_a = focusedItemRef.current) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
    }, [ampm, focusedKey]);
    useEffect(() => {
      const list = listRef.current;
      const item = focusedItemRef.current;
      if (!list || !item) return;
      if (!list.contains(document.activeElement)) return;
      item.focus();
    }, [focusedKey]);
    const emitChange = useCallback(
      (opt) => {
        if (isDisabled) return;
        const next = {
          hours: opt.hours,
          minutes: opt.minutes,
          seconds: 0,
          milliseconds: 0
        };
        onChange == null ? void 0 : onChange(next);
      },
      [isDisabled, onChange]
    );
    const switchTab = useCallback(
      (tab) => {
        if (!use12Hour || isDisabled) return;
        if (tab === "am" && amTabDisabled) return;
        if (tab === "pm" && pmTabDisabled) return;
        setAmPm(tab);
      },
      [use12Hour, isDisabled, amTabDisabled, pmTabDisabled]
    );
    const handleListKeyDown = useCallback(
      (e) => {
        if (isDisabled) return;
        if (e.key === "Escape") {
          e.preventDefault();
          onDismiss == null ? void 0 : onDismiss();
          return;
        }
        const idx = visibleOptions.findIndex((o) => o.key === focusedKey);
        if (idx < 0) return;
        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next = Math.min(visibleOptions.length - 1, idx + 1);
            setFocusedKey(visibleOptions[next].key);
            return;
          }
          case "ArrowUp": {
            e.preventDefault();
            const next = Math.max(0, idx - 1);
            setFocusedKey(visibleOptions[next].key);
            return;
          }
          case "Home": {
            e.preventDefault();
            setFocusedKey(visibleOptions[0].key);
            return;
          }
          case "End": {
            e.preventDefault();
            setFocusedKey(visibleOptions[visibleOptions.length - 1].key);
            return;
          }
          case "Enter":
          case " ":
          case "Spacebar": {
            e.preventDefault();
            emitChange(visibleOptions[idx]);
            return;
          }
        }
      },
      [isDisabled, visibleOptions, focusedKey, emitChange, onDismiss]
    );
    const rootClass = [
      "arvo-tdrop",
      use12Hour ? "arvo-tdrop--12hour" : "arvo-tdrop--24hour",
      isDisabled ? "is-disabled" : "",
      className ?? ""
    ].filter(Boolean).join(" ");
    const isActive = (opt) => {
      if (!value) return false;
      return value.hours === opt.hours && value.minutes === opt.minutes;
    };
    const ampmItems = useMemo(
      () => [
        { value: "am", label: ampmLabels.am, isDisabled: amTabDisabled },
        { value: "pm", label: ampmLabels.pm, isDisabled: pmTabDisabled }
      ],
      [ampmLabels.am, ampmLabels.pm, amTabDisabled, pmTabDisabled]
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        id,
        className: rootClass,
        style,
        role: "dialog",
        "aria-label": "Time options",
        "aria-disabled": isDisabled || void 0,
        children: [
          use12Hour && /* @__PURE__ */ jsx("div", { className: "arvo-tdrop__tabs", children: /* @__PURE__ */ jsx(
            ArvoButtonGroup,
            {
              items: ampmItems,
              value: ampm,
              variant: "primary",
              size: "sm",
              isDisabled,
              ariaLabel: "Select AM or PM",
              onChange: (detail) => {
                const next = detail.value;
                if (next === "am" || next === "pm") switchTab(next);
              }
            }
          ) }),
          /* @__PURE__ */ jsx(
            "ul",
            {
              ref: listRef,
              role: "listbox",
              className: "arvo-tdrop__list",
              tabIndex: -1,
              "aria-disabled": isDisabled || void 0,
              onKeyDown: handleListKeyDown,
              children: visibleOptions.map((opt) => {
                const active = isActive(opt);
                const focused = opt.key === focusedKey;
                const itemClass = ["arvo-tdrop__item", active ? "active" : ""].filter(Boolean).join(" ");
                return /* @__PURE__ */ jsx(
                  "li",
                  {
                    role: "option",
                    "aria-selected": active,
                    tabIndex: focused ? 0 : -1,
                    title: opt.label,
                    className: itemClass,
                    ref: focused ? focusedItemRef : void 0,
                    onClick: () => {
                      if (isDisabled) return;
                      setFocusedKey(opt.key);
                      emitChange(opt);
                    },
                    children: /* @__PURE__ */ jsx("span", { className: "arvo-tdrop__label", children: opt.label })
                  },
                  opt.key
                );
              })
            }
          )
        ]
      }
    );
  }
);
ArvoTimeDropdown.displayName = "ArvoTimeDropdown";
export {
  ArvoTimeDropdown
};
//# sourceMappingURL=index83.js.map
