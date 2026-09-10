"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
const Chip = require("./index46.cjs");
const DisclosureButton = require("./index34.cjs");
const useControllableState = require("./index90.cjs");
const ChipListContext = require("./index104.cjs");
function hideChipEl(el) {
  el.style.visibility = "hidden";
  el.style.position = "absolute";
  el.style.pointerEvents = "none";
  if (!el.hasAttribute("data-arvo-prev-tabindex")) {
    el.setAttribute("data-arvo-prev-tabindex", el.getAttribute("tabindex") ?? "");
  }
  el.setAttribute("tabindex", "-1");
}
function showChipEl(el) {
  el.style.visibility = "";
  el.style.position = "";
  el.style.pointerEvents = "";
  if (el.hasAttribute("data-arvo-prev-tabindex")) {
    const prev = el.getAttribute("data-arvo-prev-tabindex");
    if (prev) {
      el.setAttribute("tabindex", prev);
    } else {
      el.removeAttribute("tabindex");
    }
    el.removeAttribute("data-arvo-prev-tabindex");
  }
}
function getChipEls(root) {
  return Array.from(root.querySelectorAll(":scope > .arvo-chip"));
}
function isChipFocusable(chipProps, listVariant, listIsDisabled, listIsReadOnly, listIsLoading) {
  const variant = chipProps.variant ?? listVariant;
  const isDisabled = chipProps.isDisabled ?? listIsDisabled;
  const isReadOnly = chipProps.isReadOnly ?? listIsReadOnly;
  const isLoading = chipProps.isLoading ?? listIsLoading;
  if (isDisabled || isReadOnly || isLoading) return false;
  if (variant === "filter") return true;
  if (variant === "input" && chipProps.onDismiss) return true;
  if (variant === "general" && chipProps.onPress) return true;
  if (variant === "general" && !!chipProps.validationMessage && (chipProps.isInvalid || chipProps.isWarning)) {
    return true;
  }
  return false;
}
function focusChipEl(el) {
  if (!el) return false;
  if (el.style.visibility === "hidden") return false;
  if (el instanceof HTMLButtonElement && !el.disabled) {
    el.focus();
    return true;
  }
  if (el.hasAttribute("tabindex")) {
    el.focus();
    return true;
  }
  const focusable = el.querySelector('button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]');
  if (focusable) {
    focusable.focus();
    return true;
  }
  return false;
}
const SR_ONLY_LIVE_STYLE = {
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
const ArvoChipList = React.forwardRef(
  function ArvoChipList2(props, ref) {
    const {
      variant = "general",
      appearance = "primary",
      size = "md",
      colorMode = "default",
      selectionMode: selectionModeProp,
      selectedKeys: selectedKeysProp,
      defaultSelectedKeys,
      onSelectionChange,
      overflowMode: overflowModeProp = "wrap",
      maxVisibleChips = "auto",
      maxRows,
      overflowLabel,
      overflowAriaLabel,
      expandedLabel,
      onOverflowPress,
      isExpanded: isExpandedProp,
      defaultExpanded = false,
      onExpandedChange,
      isWithinField = false,
      isStaticOverflow = false,
      isReorderable = false,
      onReorder,
      isDisabled = false,
      isReadOnly = false,
      isLoading: isLoadingProp = false,
      ariaLabel,
      ariaLabelledBy,
      overflowButtonRef,
      children,
      className,
      style,
      ...rest
    } = props;
    const isLoading = isLoadingProp === true;
    const selectionMode = selectionModeProp ?? (variant === "filter" ? "multiple" : "none");
    const effectiveAppearance = colorMode === "custom" ? "utility" : appearance;
    const reorderAllowed = isReorderable && !isDisabled && !isReadOnly;
    const [isExpanded, setExpandedInternal] = useControllableState.useControllableState(
      isExpandedProp,
      defaultExpanded
    );
    const setExpanded = React.useCallback(
      (next) => {
        setExpandedInternal(next);
        onExpandedChange == null ? void 0 : onExpandedChange(next);
      },
      [setExpandedInternal, onExpandedChange]
    );
    const expansionOptIn = !isStaticOverflow && (isExpandedProp !== void 0 || defaultExpanded !== false || onExpandedChange !== void 0 || expandedLabel !== void 0 || isWithinField);
    const showOverflowAction = overflowModeProp === "single-line" || overflowModeProp === "max-rows";
    const overflowMode = isExpanded && expansionOptIn && showOverflowAction ? "wrap" : overflowModeProp;
    const containerRef = React.useRef(null);
    const overflowRef = React.useRef(null);
    const orderedKeysRef = React.useRef([]);
    const onReorderRef = React.useRef(onReorder);
    onReorderRef.current = onReorder;
    const pointerReorderRef = React.useRef(false);
    const pendingDismissedIndexRef = React.useRef(null);
    const [hiddenCount, setHiddenCount] = React.useState(0);
    const [activeKey, setActiveKey] = React.useState(null);
    const [announceMessage, setAnnounceMessage] = React.useState("");
    const lastHiddenCountRef = React.useRef(0);
    const [selectedKeys, setSelectedKeys] = useControllableState.useControllableState(
      selectedKeysProp,
      defaultSelectedKeys ?? []
    );
    const selectedSet = React.useMemo(
      () => new Set(selectedKeys.map((k) => String(k))),
      [selectedKeys]
    );
    const contextValue = {
      variant,
      // Propagate the raw appearance + colorMode; each chip applies its own
      // custom -> utility coercion (and may override per chip).
      appearance,
      size,
      colorMode,
      isDisabled,
      isReadOnly,
      isLoading
    };
    const classes = [
      "arvo-chip-list",
      `arvo-chip-list--${variant}`,
      `arvo-chip-list--${effectiveAppearance}`,
      `arvo-chip-list--${size}`,
      // overflowMode 'none' emits no layout class (parent owns clipping).
      overflowMode !== "none" ? `arvo-chip-list--${overflowMode}` : "",
      reorderAllowed ? "arvo-chip-list--reorderable" : "",
      isDisabled ? "is-disabled" : "",
      isReadOnly ? "is-readonly" : "",
      isLoading ? "loading" : "",
      className
    ].filter(Boolean).join(" ");
    const rootStyle = overflowMode === "max-rows" && typeof maxRows === "number" && maxRows > 0 ? { ...style, ["--arvo-chip-list-max-rows"]: String(maxRows) } : style;
    const resolveOverflowLabel = overflowLabel ?? ((n) => `+${n} more`);
    const resolveOverflowAria = overflowAriaLabel ?? ((n) => `Show ${n} more chips`);
    const resolveExpandedLabel = expandedLabel ?? (() => "Show less");
    const handleOverflowPress = React.useCallback(
      (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (showOverflowAction && expansionOptIn) {
          setExpanded(!isExpanded);
        }
        onOverflowPress == null ? void 0 : onOverflowPress();
      },
      [showOverflowAction, expansionOptIn, isExpanded, setExpanded, onOverflowPress]
    );
    const handleOverflowMouseDown = React.useCallback(
      (event) => {
        if (!isWithinField) return;
        event.preventDefault();
      },
      [isWithinField]
    );
    const orderedKeys = [];
    const focusableIndices = [];
    let warnedMissingKey = false;
    let chipIndex = 0;
    const preChips = [];
    let warnedNonChipChild = false;
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child) || child.type !== Chip.ArvoChip) {
        if (process.env.NODE_ENV !== "production" && !isWithinField && !warnedNonChipChild && React.isValidElement(child)) {
          warnedNonChipChild = true;
          console.warn(
            "[ArvoChipList] Only <ArvoChip> children are rendered. Other children (received `" + (typeof child.type === "string" ? child.type : child.type.displayName ?? child.type.name ?? "unknown") + "`) are dropped. If you are composing the chip-list inside a token-field, set `isWithinField` to suppress this warning."
          );
        }
        return;
      }
      const chipChild = child;
      const i = chipIndex++;
      const k = chipChild.key != null ? chipChild.key : i;
      orderedKeys.push(k);
      const focusable = isChipFocusable(
        chipChild.props,
        variant,
        isDisabled,
        isReadOnly,
        isLoading
      );
      if (focusable) focusableIndices.push(i);
      preChips.push({ child: chipChild, key: k, index: i, focusable });
    });
    let resolvedActiveKey = null;
    if (activeKey !== null && preChips.some((c) => c.focusable && c.key === activeKey)) {
      resolvedActiveKey = activeKey;
    } else if (variant === "filter" && selectedKeys.length > 0) {
      const firstSelected = preChips.find(
        (c) => c.focusable && selectedSet.has(String(c.key))
      );
      if (firstSelected) resolvedActiveKey = firstSelected.key;
    }
    if (resolvedActiveKey === null) {
      const firstFocusable = preChips.find((c) => c.focusable);
      if (firstFocusable) resolvedActiveKey = firstFocusable.key;
    }
    const processedChildren = preChips.map(({ child: chipChild, key, index: i, focusable }) => {
      const injected = {};
      if (selectionMode !== "none") {
        if (chipChild.key == null) {
          if (process.env.NODE_ENV !== "production" && !warnedMissingKey) {
            warnedMissingKey = true;
            console.warn(
              "[ArvoChipList] Filter selection requires a stable `key` on each ArvoChip child; a child without a key cannot participate in selectedKeys and will not stay in sync."
            );
          }
        } else {
          const keyStr = String(key);
          const childOnSelectedChange = chipChild.props.onSelectedChange;
          const childLabel = typeof chipChild.props.label === "string" ? chipChild.props.label : "";
          injected.isSelected = selectedSet.has(keyStr);
          injected.onSelectedChange = (selected) => {
            let nextKeys;
            if (selectionMode === "single") {
              nextKeys = selected ? [keyStr] : [];
            } else {
              nextKeys = selected ? [...selectedKeys, keyStr] : selectedKeys.filter((k) => String(k) !== keyStr);
            }
            setSelectedKeys(nextKeys);
            onSelectionChange == null ? void 0 : onSelectionChange(nextKeys);
            setActiveKey(key);
            if (childLabel) {
              setAnnounceMessage(
                selected ? `${childLabel} filter selected.` : `${childLabel} filter removed.`
              );
            }
            childOnSelectedChange == null ? void 0 : childOnSelectedChange(selected);
          };
        }
      }
      if (variant === "input" && chipChild.props.onDismiss) {
        const childOnDismiss = chipChild.props.onDismiss;
        const childLabel = typeof chipChild.props.label === "string" ? chipChild.props.label : "";
        injected.onDismiss = () => {
          pendingDismissedIndexRef.current = i;
          if (childLabel) setAnnounceMessage(`${childLabel} removed.`);
          childOnDismiss();
        };
      }
      if (reorderAllowed) {
        const chipLabel = typeof chipChild.props.label === "string" ? chipChild.props.label : "";
        injected.dragHandleProps = {
          "aria-label": `Reorder ${chipLabel}`,
          tabIndex: 0
        };
      }
      if (focusable && focusableIndices.length > 1 && chipChild.props.tabIndex === void 0) {
        injected.tabIndex = key === resolvedActiveKey ? 0 : -1;
      }
      return Object.keys(injected).length > 0 ? React.cloneElement(chipChild, injected) : chipChild;
    });
    orderedKeysRef.current = orderedKeys;
    const childKeySignature = React.useMemo(
      () => React.Children.toArray(children).map((c) => React.isValidElement(c) ? String(c.key) : "_").join("|"),
      [children]
    );
    const mergedRef = React.useCallback(
      (node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );
    React.useEffect(() => {
      const root = containerRef.current;
      if (!root) return;
      if (overflowMode === "none" || overflowMode === "wrap") {
        for (const el of getChipEls(root)) showChipEl(el);
        setHiddenCount(0);
        return;
      }
      const measure = () => {
        var _a;
        const chips = getChipEls(root);
        for (const el of chips) showChipEl(el);
        if (typeof maxVisibleChips === "number") {
          let hidden = 0;
          chips.forEach((el, i) => {
            if (i >= maxVisibleChips) {
              hideChipEl(el);
              hidden += 1;
            }
          });
          setHiddenCount(hidden);
          return;
        }
        let firstHidden = -1;
        if (overflowMode === "single-line") {
          const rootRect = root.getBoundingClientRect();
          const overflowWidth = ((_a = overflowRef.current) == null ? void 0 : _a.offsetWidth) ?? 0;
          const limitRight = rootRect.right - overflowWidth;
          for (let i = 0; i < chips.length; i++) {
            if (chips[i].getBoundingClientRect().right > limitRight) {
              firstHidden = i;
              break;
            }
          }
        } else {
          const rows = typeof maxRows === "number" && maxRows > 0 ? maxRows : 1;
          const rowTops = [];
          for (let i = 0; i < chips.length; i++) {
            const top = chips[i].offsetTop;
            if (!rowTops.includes(top)) rowTops.push(top);
            if (rowTops.indexOf(top) >= rows) {
              firstHidden = i;
              break;
            }
          }
        }
        if (firstHidden >= 0) {
          for (let i = firstHidden; i < chips.length; i++) hideChipEl(chips[i]);
          setHiddenCount(chips.length - firstHidden);
        } else {
          setHiddenCount(0);
        }
      };
      if (typeof ResizeObserver === "undefined") {
        measure();
        return;
      }
      const observer = new ResizeObserver(measure);
      observer.observe(root);
      measure();
      return () => observer.disconnect();
    }, [
      overflowMode,
      maxVisibleChips,
      maxRows,
      size,
      variant,
      appearance,
      colorMode,
      reorderAllowed,
      childKeySignature
    ]);
    React.useEffect(() => {
      if (!reorderAllowed) return;
      const root = containerRef.current;
      if (!root) return;
      const sortable = core.createSortableList(root, {
        itemSelector: ".arvo-chip",
        handleSelector: ".arvo-chip__grip",
        onPreview: () => {
          pointerReorderRef.current = true;
        },
        onCancel: () => {
          pointerReorderRef.current = false;
        },
        onCommit: (fromIndex, toIndex) => {
          var _a;
          const keys = orderedKeysRef.current;
          if (fromIndex < 0 || fromIndex >= keys.length) return;
          const fromPointer = pointerReorderRef.current;
          pointerReorderRef.current = false;
          const next = keys.slice();
          const [moved] = next.splice(fromIndex, 1);
          const insertAt = fromPointer ? fromIndex < toIndex ? toIndex - 1 : toIndex : toIndex;
          const clamped = Math.max(0, Math.min(insertAt, next.length));
          next.splice(clamped, 0, moved);
          (_a = onReorderRef.current) == null ? void 0 : _a.call(onReorderRef, next);
          requestAnimationFrame(() => {
            var _a2;
            const r = containerRef.current;
            if (!r) return;
            const movedChip = getChipEls(r)[clamped];
            (_a2 = movedChip == null ? void 0 : movedChip.querySelector(".arvo-chip__grip")) == null ? void 0 : _a2.focus();
          });
        }
      });
      return () => sortable.destroy();
    }, [reorderAllowed]);
    const handleListKeyDown = React.useCallback(
      (e) => {
        const root = containerRef.current;
        if (!root) return;
        const key = e.key;
        if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") {
          return;
        }
        const target = e.target;
        if (!target) return;
        const allChips = getChipEls(root);
        const visible = allChips.filter(
          (el) => el.style.visibility !== "hidden" && (el.hasAttribute("tabindex") || el instanceof HTMLButtonElement && !el.disabled)
        );
        if (visible.length === 0) return;
        const currentIdx = visible.findIndex(
          (el) => el === target || el.contains(target)
        );
        if (currentIdx === -1) return;
        let nextIdx = currentIdx;
        if (key === "ArrowRight" || key === "ArrowDown") {
          nextIdx = Math.min(currentIdx + 1, visible.length - 1);
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          nextIdx = Math.max(currentIdx - 1, 0);
        } else if (key === "Home") {
          nextIdx = 0;
        } else if (key === "End") {
          nextIdx = visible.length - 1;
        }
        if (nextIdx === currentIdx) {
          if (key !== "Home" && key !== "End") e.preventDefault();
          return;
        }
        e.preventDefault();
        const nextEl = visible[nextIdx];
        const allIdx = allChips.indexOf(nextEl);
        const nextKey = orderedKeysRef.current[allIdx];
        if (nextKey !== void 0) setActiveKey(nextKey);
        nextEl.focus();
      },
      []
    );
    React.useLayoutEffect(() => {
      const idx = pendingDismissedIndexRef.current;
      if (idx === null) return;
      pendingDismissedIndexRef.current = null;
      const root = containerRef.current;
      if (!root) return;
      const chips = getChipEls(root);
      const nextEl = chips[idx];
      const prevEl = chips[idx - 1];
      if (focusChipEl(nextEl)) return;
      if (focusChipEl(prevEl)) return;
      const overflowEl = overflowRef.current;
      if (overflowEl instanceof HTMLButtonElement && !overflowEl.disabled) {
        overflowEl.focus();
        return;
      }
      const hadTabIndex = root.hasAttribute("tabindex");
      if (!hadTabIndex) root.setAttribute("tabindex", "-1");
      root.focus({ preventScroll: true });
      if (!hadTabIndex) {
        const onBlur = () => {
          root.removeAttribute("tabindex");
          root.removeEventListener("blur", onBlur);
        };
        root.addEventListener("blur", onBlur);
      }
    }, [childKeySignature]);
    React.useEffect(() => {
      if (hiddenCount === lastHiddenCountRef.current) return;
      const prev = lastHiddenCountRef.current;
      lastHiddenCountRef.current = hiddenCount;
      if (hiddenCount === 0 && prev === 0) return;
      setAnnounceMessage(
        hiddenCount > 0 ? `${hiddenCount} more ${hiddenCount === 1 ? "chip" : "chips"} hidden.` : "All chips visible."
      );
    }, [hiddenCount]);
    const showDisclosureNow = isStaticOverflow ? showOverflowAction && hiddenCount > 0 : showOverflowAction && (hiddenCount > 0 || isExpanded && expansionOptIn);
    const useExpandedLabel = !isStaticOverflow && isExpanded;
    const disclosureLabel = useExpandedLabel ? resolveExpandedLabel() : resolveOverflowLabel(hiddenCount);
    const disclosureAriaLabel = useExpandedLabel ? resolveExpandedLabel() : resolveOverflowAria(hiddenCount);
    const disclosureTabIndex = isDisabled || isWithinField ? -1 : void 0;
    const disclosureSize = "md";
    const disclosureRefCallback = React.useCallback(
      (node) => {
        overflowRef.current = node;
        if (typeof overflowButtonRef === "function") overflowButtonRef(node);
        else if (overflowButtonRef)
          overflowButtonRef.current = node;
      },
      [overflowButtonRef]
    );
    const staticOverflowRefCallback = React.useCallback(
      (node) => {
        overflowRef.current = node;
      },
      []
    );
    return /* @__PURE__ */ jsxRuntime.jsx(ChipListContext.ChipListContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntime.jsxs(
      "div",
      {
        ...rest,
        ref: mergedRef,
        role: "group",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-disabled": isDisabled || void 0,
        "aria-readonly": isReadOnly || void 0,
        "aria-busy": isLoading || void 0,
        "data-within-field": isWithinField || void 0,
        className: classes,
        style: rootStyle,
        onKeyDown: handleListKeyDown,
        children: [
          processedChildren,
          showDisclosureNow && (isStaticOverflow ? (
            // Non-interactive "+N more" indicator -- no chevron, no click,
            // not focusable. Used by strict single-line consumers (e.g.
            // ArvoMultiSelect overflowMode='single-line') where chips
            // cannot expand back into view.
            /* @__PURE__ */ jsxRuntime.jsx(
              "span",
              {
                ref: staticOverflowRefCallback,
                className: "arvo-chip-list__overflow arvo-chip-list__overflow--static",
                "aria-label": disclosureAriaLabel,
                "aria-hidden": isDisabled || void 0,
                children: disclosureLabel
              }
            )
          ) : /* @__PURE__ */ jsxRuntime.jsx(
            DisclosureButton.default,
            {
              ref: disclosureRefCallback,
              size: disclosureSize,
              hasChevron: true,
              isExpanded,
              label: disclosureLabel,
              "aria-label": disclosureAriaLabel,
              tabIndex: disclosureTabIndex,
              "aria-hidden": isDisabled || void 0,
              className: "arvo-chip-list__overflow",
              onMouseDown: handleOverflowMouseDown,
              onClick: handleOverflowPress
            }
          )),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: "arvo-chip-list__live",
              role: "status",
              "aria-live": "polite",
              "aria-atomic": "true",
              style: SR_ONLY_LIVE_STYLE,
              children: announceMessage
            }
          )
        ]
      }
    ) });
  }
);
exports.ArvoChipList = ArvoChipList;
exports.default = ArvoChipList;
//# sourceMappingURL=index47.cjs.map
