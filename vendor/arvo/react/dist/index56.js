import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useId, useRef, useImperativeHandle, useState, useCallback, useMemo, useLayoutEffect, useEffect } from "react";
import { filterGroups, filterItems } from "@arvo/core";
import { FormLabel } from "./index12.js";
import { ArvoMessageAlert } from "./index13.js";
import { ArvoChipList } from "./index47.js";
import { ArvoChip } from "./index46.js";
import { ArvoOptionList } from "./index62.js";
import { ArvoIconButton } from "./index17.js";
import { useTooltip } from "./index10.js";
import { useControllableState } from "./index90.js";
function isGrouped(items) {
  return items.length > 0 && "items" in items[0];
}
function flattenItems(items) {
  if (isGrouped(items)) return items.flatMap((g) => g.items);
  return items;
}
function applyFilter(items, query, filterFn) {
  if (!query) return items;
  if (filterFn) {
    if (isGrouped(items)) {
      const result = [];
      for (const group of items) {
        const filtered = group.items.filter((item) => filterFn(item, query));
        if (filtered.length > 0) result.push({ ...group, items: filtered });
      }
      return result;
    }
    return items.filter((item) => filterFn(item, query));
  }
  if (isGrouped(items)) return filterGroups(items, { query });
  return filterItems(items, { query });
}
function applyMaxSelections(items, selected) {
  const cap = (arr) => arr.map((it) => selected.includes(it.value) ? it : { ...it, isDisabled: true });
  if (isGrouped(items)) return items.map((g) => ({ ...g, items: cap(g.items) }));
  return cap(items);
}
const ArvoMultiSelect = forwardRef(
  function ArvoMultiSelect2({
    items,
    value,
    defaultValue,
    inputValue: inputValueProp,
    placeholder,
    label,
    contextHelp,
    isDisabled = false,
    isRequired = false,
    isInvalid = false,
    errorMsg,
    errorDisplay = "inline",
    isClearable = true,
    isLoading: isLoadingProp = false,
    isReadOnly = false,
    width,
    isFullWidth = false,
    surface = "filled",
    overflowMode = "expandable",
    maxRows = 3,
    expandedMaxRows = 5,
    isExpanded: expandedProp,
    defaultExpanded = false,
    chipAppearance = "outline",
    maxSelections,
    placement = "bottom-start",
    maxHeight,
    hasGroupDividers = true,
    filterFn,
    closeOnSelect = false,
    isOpen: openProp,
    defaultOpen = false,
    onChange,
    onInputChange,
    onRemove,
    onClear,
    onOpen,
    onClose,
    onOpenChange,
    onExpandedChange,
    chipListProps,
    optionListProps,
    className
  }, ref) {
    const isLoading = isLoadingProp === true;
    const uid = useId();
    const baseId = `arvo-multi-sel-${uid.replace(/[:]/g, "")}`;
    const fieldId = `${baseId}-field`;
    const inputId = `${baseId}-input`;
    const labelId = `${baseId}-lbl`;
    const errorId = `${baseId}-err`;
    const rootRef = useRef(null);
    const fieldRef = useRef(null);
    const inputRef = useRef(null);
    const errIcoRef = useRef(null);
    const chipListRef = useRef(null);
    const overflowBtnRef = useRef(null);
    useImperativeHandle(ref, () => rootRef.current, []);
    const interactive = !isDisabled && !isReadOnly && !isLoading;
    const [activeChipIndex, setActiveChipIndex] = useState(-1);
    const showTooltipIcon = isInvalid && errorDisplay === "tooltip";
    const showInlineAlert = isInvalid && errorDisplay === "inline";
    useTooltip({
      triggerRef: errIcoRef,
      tooltip: showTooltipIcon && errorMsg ? errorMsg : void 0
    });
    const [currentValue, setValueState] = useControllableState(
      value,
      defaultValue ?? []
    );
    const [currentInputValue, setInputValueState] = useControllableState(
      inputValueProp,
      ""
    );
    const [isOpen, setOpenInternal] = useControllableState(openProp, defaultOpen);
    const [expandedState, setExpandedInternal] = useControllableState(
      expandedProp,
      defaultExpanded
    );
    const isValueControlled = value !== void 0;
    const setOpen = useCallback(
      (next) => {
        setOpenInternal(next);
        onOpenChange == null ? void 0 : onOpenChange(next);
      },
      [setOpenInternal, onOpenChange]
    );
    const dispatchSel = useCallback(
      (name, detail, cancelable = true) => {
        var _a;
        const ev = new CustomEvent(name, { bubbles: true, cancelable, detail });
        (_a = rootRef.current) == null ? void 0 : _a.dispatchEvent(ev);
        return ev;
      },
      []
    );
    const requestOpen = useCallback(() => {
      if (isOpen || isDisabled || isLoading || isReadOnly) return;
      if ((onOpen == null ? void 0 : onOpen()) === false) return;
      const ev = dispatchSel("multi-sel:open", void 0, true);
      if (ev.defaultPrevented) return;
      setOpen(true);
    }, [isOpen, isDisabled, isLoading, isReadOnly, onOpen, setOpen, dispatchSel]);
    const requestClose = useCallback(() => {
      if (!isOpen) return;
      if ((onClose == null ? void 0 : onClose()) === false) return;
      const ev = dispatchSel("multi-sel:close", void 0, true);
      if (ev.defaultPrevented) return;
      setOpen(false);
    }, [isOpen, onClose, setOpen, dispatchSel]);
    const handleListOpenChange = useCallback(
      (next) => {
        if (next) return;
        if (!isOpen) return;
        setOpen(false);
      },
      [isOpen, setOpen]
    );
    const optionByValue = useMemo(() => {
      const map = /* @__PURE__ */ new Map();
      for (const it of flattenItems(items)) map.set(it.value, it);
      return map;
    }, [items]);
    const selectedOptions = useMemo(
      () => currentValue.map((v) => ({ value: v, option: optionByValue.get(v) ?? null })),
      [currentValue, optionByValue]
    );
    const hasValue = currentValue.length > 0;
    const processedItems = useMemo(() => {
      const filtered = applyFilter(items, currentInputValue, filterFn);
      const atCap = typeof maxSelections === "number" && currentValue.length >= maxSelections;
      return atCap ? applyMaxSelections(filtered, currentValue) : filtered;
    }, [items, currentInputValue, filterFn, maxSelections, currentValue]);
    const handleOptionChange = useCallback(
      (nextValue, item, selected) => {
        const arr = Array.isArray(nextValue) ? nextValue : [];
        if (!isValueControlled) setValueState(arr);
        onChange == null ? void 0 : onChange(arr, item, selected);
        dispatchSel("multi-sel:change", { value: arr, item, isSelected: selected }, true);
      },
      [isValueControlled, setValueState, onChange, dispatchSel]
    );
    const handleRemove = useCallback(
      (val, item) => {
        if (!interactive) return;
        const ev = dispatchSel("multi-sel:remove", { value: val, item }, true);
        if (ev.defaultPrevented) return;
        const next = currentValue.filter((v) => v !== val);
        if (!isValueControlled) setValueState(next);
        if (item) onRemove == null ? void 0 : onRemove(val, item);
        onChange == null ? void 0 : onChange(next, item, false);
        dispatchSel("multi-sel:change", { value: next, item, isSelected: false }, true);
      },
      [interactive, dispatchSel, currentValue, isValueControlled, setValueState, onRemove, onChange]
    );
    const getVisibleChipEls = useCallback(() => {
      const root = chipListRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll(":scope > .arvo-chip")
      ).filter((el) => el.style.visibility !== "hidden");
    }, []);
    const getDisclosureEl = useCallback(() => {
      return overflowBtnRef.current ?? null;
    }, []);
    const getCursorSlotCount = useCallback(() => {
      const chipCount = getVisibleChipEls().length;
      const hasDisclosure = !!getDisclosureEl();
      return chipCount + (hasDisclosure ? 1 : 0);
    }, [getVisibleChipEls, getDisclosureEl]);
    const activeIsDisclosure = useCallback(() => {
      const chipCount = getVisibleChipEls().length;
      const hasDisclosure = !!getDisclosureEl();
      return hasDisclosure && activeChipIndex === chipCount;
    }, [activeChipIndex, getVisibleChipEls, getDisclosureEl]);
    const clearActiveChip = useCallback(() => {
      setActiveChipIndex(-1);
    }, []);
    const removeActiveChip = useCallback(() => {
      if (activeIsDisclosure()) return;
      const els = getVisibleChipEls();
      if (activeChipIndex < 0 || activeChipIndex >= els.length) return;
      const targetEl = els[activeChipIndex];
      const id = targetEl.id;
      const chipIndex = parseInt(id.replace(`${baseId}-chip-`, ""), 10);
      if (Number.isNaN(chipIndex)) return;
      const val = currentValue[chipIndex];
      if (val === void 0) return;
      handleRemove(val, optionByValue.get(val) ?? null);
      requestAnimationFrame(() => {
        const after = getVisibleChipEls();
        if (after.length === 0) setActiveChipIndex(-1);
        else if (activeChipIndex >= after.length) setActiveChipIndex(after.length - 1);
        else setActiveChipIndex(activeChipIndex);
      });
    }, [
      activeChipIndex,
      activeIsDisclosure,
      baseId,
      currentValue,
      getVisibleChipEls,
      handleRemove,
      optionByValue
    ]);
    useLayoutEffect(() => {
      const root = chipListRef.current;
      const inputEl = inputRef.current;
      if (!inputEl) return;
      const all = root ? Array.from(root.querySelectorAll(":scope > .arvo-chip")) : [];
      for (const el of all) el.classList.remove("highlighted");
      const disclosure = overflowBtnRef.current;
      disclosure == null ? void 0 : disclosure.classList.remove("highlighted");
      const visible = all.filter((el) => el.style.visibility !== "hidden");
      const totalSlots = visible.length + (disclosure ? 1 : 0);
      if (activeChipIndex < 0 || activeChipIndex >= totalSlots) {
        if (!isOpen) inputEl.removeAttribute("aria-activedescendant");
        return;
      }
      const activeEl = activeChipIndex < visible.length ? visible[activeChipIndex] : disclosure;
      activeEl == null ? void 0 : activeEl.classList.add("highlighted");
      if (!isOpen && (activeEl == null ? void 0 : activeEl.id)) {
        inputEl.setAttribute("aria-activedescendant", activeEl.id);
      } else if (!isOpen) {
        inputEl.removeAttribute("aria-activedescendant");
      }
    }, [activeChipIndex, isOpen, currentValue, expandedState]);
    useEffect(() => {
      const slots = getCursorSlotCount();
      if (activeChipIndex >= slots) setActiveChipIndex(-1);
    }, [currentValue.length, activeChipIndex, getCursorSlotCount]);
    const handleClearAll = useCallback(
      (e) => {
        var _a;
        e == null ? void 0 : e.stopPropagation();
        if (!interactive) return;
        if (currentValue.length === 0 && currentInputValue === "") return;
        const previousValue = currentValue;
        if (!isValueControlled) setValueState([]);
        setInputValueState("");
        onClear == null ? void 0 : onClear({ previousValue });
        dispatchSel("multi-sel:clear", { previousValue }, false);
        onChange == null ? void 0 : onChange([], null, false);
        dispatchSel("multi-sel:change", { value: [], item: null, isSelected: false }, true);
        (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
      },
      [
        interactive,
        currentValue,
        currentInputValue,
        isValueControlled,
        setValueState,
        setInputValueState,
        onClear,
        onChange,
        dispatchSel
      ]
    );
    const setExpanded = useCallback(
      (next) => {
        setExpandedInternal(next);
        onExpandedChange == null ? void 0 : onExpandedChange(next);
        dispatchSel("multi-sel:expand", { expanded: next }, false);
      },
      [setExpandedInternal, onExpandedChange, dispatchSel]
    );
    const handleInputChange = useCallback(
      (e) => {
        if (!interactive) return;
        const text = e.target.value;
        clearActiveChip();
        setInputValueState(text);
        onInputChange == null ? void 0 : onInputChange(text);
        dispatchSel("multi-sel:input", { value: text }, false);
        if (text.length > 0 && !isOpen) requestOpen();
      },
      [interactive, clearActiveChip, setInputValueState, onInputChange, dispatchSel, isOpen, requestOpen]
    );
    const handleInputFocus = useCallback(() => {
      clearActiveChip();
    }, [clearActiveChip]);
    const handleInputBlur = useCallback(
      (e) => {
        var _a;
        const next = e.relatedTarget;
        if (next && ((_a = rootRef.current) == null ? void 0 : _a.contains(next))) return;
        if (currentInputValue.length > 0) {
          setInputValueState("");
          onInputChange == null ? void 0 : onInputChange("");
          dispatchSel("multi-sel:input", { value: "" }, false);
        }
        clearActiveChip();
      },
      [currentInputValue, setInputValueState, onInputChange, dispatchSel, clearActiveChip]
    );
    const handleFieldMouseDown = useCallback(
      (e) => {
        if (!interactive) return;
        const target = e.target;
        if (!target) return;
        if (target === inputRef.current) return;
        if (target.tagName === "INPUT") return;
        e.preventDefault();
      },
      [interactive]
    );
    const handleFieldClick = useCallback(
      (e) => {
        var _a, _b, _c;
        if (!interactive) return;
        const target = e.target;
        if (target.closest(".arvo-multi-sel__actions")) return;
        if (target.closest(".arvo-chip-list__overflow")) {
          (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
          return;
        }
        if (target.closest(".arvo-chip__dismiss")) return;
        if (target.closest(".arvo-chip")) {
          clearActiveChip();
          (_b = inputRef.current) == null ? void 0 : _b.focus({ preventScroll: true });
          return;
        }
        clearActiveChip();
        (_c = inputRef.current) == null ? void 0 : _c.focus({ preventScroll: true });
        if (!isOpen) requestOpen();
      },
      [interactive, isOpen, requestOpen, clearActiveChip]
    );
    const handleChevronClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (!interactive) return;
        if (isOpen) requestClose();
        else {
          requestOpen();
          requestAnimationFrame(() => {
            var _a;
            return (_a = inputRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
          });
        }
      },
      [interactive, isOpen, requestOpen, requestClose]
    );
    const handleInputKeyDown = useCallback(
      (e) => {
        var _a, _b;
        if (isDisabled || isLoading || isReadOnly) return;
        const hasText = currentInputValue.length > 0;
        const inputEl = e.currentTarget;
        const chipActive = activeChipIndex >= 0;
        const visibleChipCount = getVisibleChipEls().length;
        const hasDisclosure = !!getDisclosureEl();
        const slotCount = visibleChipCount + (hasDisclosure ? 1 : 0);
        const disclosureActive = activeIsDisclosure();
        switch (e.key) {
          case "ArrowDown":
          case "ArrowUp":
            clearActiveChip();
            if (!isOpen) {
              e.preventDefault();
              requestOpen();
            }
            break;
          case "ArrowLeft": {
            if (!chipActive && (inputEl.selectionStart !== 0 || inputEl.selectionEnd !== 0)) {
              break;
            }
            if (slotCount === 0) break;
            e.preventDefault();
            e.stopPropagation();
            if (!chipActive) {
              setActiveChipIndex(slotCount - 1);
            } else {
              setActiveChipIndex(Math.max(0, activeChipIndex - 1));
            }
            break;
          }
          case "ArrowRight": {
            if (!chipActive) break;
            e.preventDefault();
            e.stopPropagation();
            const next = activeChipIndex + 1;
            if (next >= slotCount) {
              clearActiveChip();
            } else {
              setActiveChipIndex(next);
            }
            break;
          }
          case "Home": {
            if (!chipActive) break;
            if (slotCount === 0) break;
            e.preventDefault();
            e.stopPropagation();
            setActiveChipIndex(0);
            break;
          }
          case "End": {
            if (!chipActive) break;
            e.preventDefault();
            e.stopPropagation();
            clearActiveChip();
            break;
          }
          case "Enter": {
            if (disclosureActive) {
              e.preventDefault();
              e.stopPropagation();
              (_a = getDisclosureEl()) == null ? void 0 : _a.click();
            }
            break;
          }
          case " ":
            if (disclosureActive) {
              e.preventDefault();
              e.stopPropagation();
              (_b = getDisclosureEl()) == null ? void 0 : _b.click();
            } else if (hasText) {
              e.stopPropagation();
            } else {
              e.preventDefault();
              if (!isOpen) requestOpen();
            }
            break;
          case "Backspace":
            if (disclosureActive) {
              e.preventDefault();
              e.stopPropagation();
            } else if (chipActive) {
              e.preventDefault();
              e.stopPropagation();
              removeActiveChip();
            } else if (!hasText && currentValue.length > 0) {
              e.stopPropagation();
              const lastVal = currentValue[currentValue.length - 1];
              handleRemove(lastVal, optionByValue.get(lastVal) ?? null);
            }
            break;
          case "Delete":
            if (disclosureActive) {
              e.preventDefault();
              e.stopPropagation();
            } else if (chipActive) {
              e.preventDefault();
              e.stopPropagation();
              removeActiveChip();
            }
            break;
          case "Escape":
            if (isOpen) {
              clearActiveChip();
            } else if (chipActive) {
              e.preventDefault();
              e.stopPropagation();
              clearActiveChip();
            } else if (hasText) {
              e.preventDefault();
              e.stopPropagation();
              setInputValueState("");
              onInputChange == null ? void 0 : onInputChange("");
              dispatchSel("multi-sel:input", { value: "" }, false);
            }
            break;
          case "Tab":
            if (isOpen) requestClose();
            clearActiveChip();
            break;
        }
      },
      [
        isDisabled,
        isLoading,
        isReadOnly,
        currentInputValue,
        currentValue,
        isOpen,
        activeChipIndex,
        getVisibleChipEls,
        getDisclosureEl,
        activeIsDisclosure,
        clearActiveChip,
        removeActiveChip,
        requestOpen,
        requestClose,
        handleRemove,
        optionByValue,
        setInputValueState,
        onInputChange,
        dispatchSel
      ]
    );
    const isSingleLine = overflowMode === "single-line";
    const canExpand = overflowMode === "expandable";
    const expandedActive = canExpand && expandedState;
    const chipListOverflowMode = overflowMode === "expandable" ? "max-rows" : isSingleLine ? "single-line" : "wrap";
    const classes = [
      "arvo-multi-sel",
      `arvo-multi-sel--surface-${surface}`,
      isFullWidth && "arvo-multi-sel--full-width",
      isClearable && "arvo-multi-sel--clearable",
      `arvo-multi-sel--${overflowMode}`,
      expandedActive && "arvo-multi-sel--expanded",
      isLoading && "loading",
      isDisabled && "is-disabled",
      isReadOnly && "is-readonly",
      isInvalid && "has-error",
      showTooltipIcon && "error-tooltip",
      isOpen && "open",
      hasValue && "has-value",
      className
    ].filter(Boolean).join(" ");
    const rootStyle = (() => {
      const base = {};
      const effectiveWidth = isFullWidth ? "100%" : width;
      if (effectiveWidth) base["--arvo-form-input-width"] = effectiveWidth;
      base["--arvo-multi-sel-max-rows"] = String(maxRows);
      base["--arvo-multi-sel-expanded-max-rows"] = String(expandedMaxRows);
      return base;
    })();
    return /* @__PURE__ */ jsxs("div", { ref: rootRef, className: classes, style: rootStyle, children: [
      label && /* @__PURE__ */ jsx(
        FormLabel,
        {
          htmlFor: inputId,
          id: labelId,
          isRequired,
          isDisabled,
          isInvalid,
          contextHelp,
          className: "arvo-multi-sel__lbl",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          ref: fieldRef,
          id: fieldId,
          className: "arvo-multi-sel__field",
          role: "combobox",
          "aria-autocomplete": "list",
          "aria-required": isRequired || void 0,
          "aria-invalid": isInvalid || void 0,
          "aria-disabled": isDisabled || void 0,
          "aria-busy": isLoading || void 0,
          "aria-labelledby": label ? labelId : void 0,
          "aria-label": label ? void 0 : placeholder ?? "Select",
          onMouseDown: handleFieldMouseDown,
          onClick: handleFieldClick,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "arvo-multi-sel__value", children: [
              hasValue && /* @__PURE__ */ jsx(
                ArvoChipList,
                {
                  ...chipListProps,
                  ref: chipListRef,
                  variant: "input",
                  appearance: chipAppearance,
                  overflowMode: chipListOverflowMode,
                  maxRows,
                  isWithinField: true,
                  isStaticOverflow: isSingleLine,
                  isExpanded: expandedActive,
                  onExpandedChange: setExpanded,
                  expandedLabel: () => "Show less",
                  overflowButtonRef: overflowBtnRef,
                  isDisabled,
                  isReadOnly,
                  isLoading,
                  ariaLabel: label ? `${label} selected options` : "Selected options",
                  className: "arvo-multi-sel__chips",
                  children: selectedOptions.map(({ value: v, option }, i) => {
                    const chipLabel = (option == null ? void 0 : option.label) ?? String(v);
                    return /* @__PURE__ */ jsx(
                      ArvoChip,
                      {
                        id: `${baseId}-chip-${i}`,
                        variant: "input",
                        label: chipLabel,
                        icon: option == null ? void 0 : option.icon,
                        avatar: (option == null ? void 0 : option.avatar) ? /* @__PURE__ */ jsx("img", { src: option.avatar, alt: "", className: "arvo-chip__avatar-img" }) : void 0,
                        dismissLabel: `Remove ${chipLabel}`,
                        onDismiss: () => handleRemove(v, option)
                      },
                      String(v)
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  id: inputId,
                  type: "text",
                  className: "arvo-multi-sel__input",
                  value: currentInputValue,
                  placeholder: hasValue ? void 0 : placeholder,
                  disabled: isDisabled,
                  readOnly: isReadOnly || isLoading,
                  autoComplete: "off",
                  "aria-autocomplete": "list",
                  "aria-labelledby": label ? labelId : void 0,
                  "aria-label": label ? void 0 : placeholder ?? "Select",
                  "aria-required": isRequired || void 0,
                  "aria-invalid": isInvalid || void 0,
                  "aria-busy": isLoading || void 0,
                  "aria-describedby": showInlineAlert && errorMsg ? errorId : void 0,
                  onChange: handleInputChange,
                  onFocus: handleInputFocus,
                  onBlur: handleInputBlur,
                  onKeyDownCapture: handleInputKeyDown
                }
              )
            ] }),
            showTooltipIcon && /* @__PURE__ */ jsx(
              ArvoMessageAlert,
              {
                ref: errIcoRef,
                type: "negative",
                isInline: true,
                message: errorMsg,
                className: "arvo-multi-sel__err-ico"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "arvo-multi-sel__actions", children: [
              isClearable && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  ArvoIconButton,
                  {
                    size: "xs",
                    variant: "tertiary",
                    icon: "close",
                    tooltip: "Clear all",
                    tabIndex: -1,
                    isDisabled,
                    onClick: handleClearAll,
                    className: "arvo-multi-sel__clear"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "arvo-multi-sel__sep", "aria-hidden": "true" })
              ] }),
              /* @__PURE__ */ jsx(
                ArvoIconButton,
                {
                  size: "sm",
                  variant: "tertiary",
                  icon: "angle-down",
                  tooltip: "Toggle options",
                  tabIndex: -1,
                  isDisabled,
                  onClick: handleChevronClick,
                  className: "arvo-multi-sel__ico"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "arvo-multi-sel__border" })
          ]
        }
      ),
      showInlineAlert && errorMsg && /* @__PURE__ */ jsx(ArvoMessageAlert, { type: "negative", id: errorId, message: errorMsg }),
      /* @__PURE__ */ jsx(
        ArvoOptionList,
        {
          ...optionListProps,
          triggerRef: fieldRef,
          activeDescendantRef: inputRef,
          items: processedItems,
          value: currentValue,
          isMultiple: true,
          isOpen,
          placement,
          maxHeight,
          hasGroupDividers,
          isDisabled,
          ariaLabel: label,
          closeOnSelect,
          wrapNavigation: false,
          onChange: handleOptionChange,
          onOpenChange: handleListOpenChange
        }
      )
    ] });
  }
);
export {
  ArvoMultiSelect
};
//# sourceMappingURL=index56.js.map
