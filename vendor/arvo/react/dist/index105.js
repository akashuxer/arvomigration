import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useState, useRef, useEffect, useMemo, useCallback, useImperativeHandle } from "react";
import { useControllableState } from "./index90.js";
import { createTabRoving } from "@arvo/core";
import { attachOverlayFooterFit, validateHeaderAction, runItemFilter, formatMatchCountMessage, clampFooterActions } from "@arvo/utils";
import { ArvoIconButton } from "./index17.js";
import ArvoDropdownIconButton from "./index60.js";
import ArvoSplitIconButton from "./index59.js";
import ArvoSwitch from "./index26.js";
import ArvoCheckbox from "./index23.js";
import ArvoTabstrip from "./index36.js";
import ArvoSearch from "./index51.js";
import { ArvoAdvanceSearch } from "./index52.js";
import { ArvoButton } from "./index16.js";
import { ArvoBannerAlert } from "./index48.js";
import { ArvoMessageAlert } from "./index13.js";
function HeaderAction({ action, block, isDisabled }) {
  if (!validateHeaderAction(action)) return null;
  const baseClass = `${block}__action`;
  switch (action.type) {
    case "btn": {
      const tooltip = action.tooltip ?? action.label ?? action.id;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: baseClass,
          "data-action-id": action.id,
          "data-action-type": action.type,
          children: /* @__PURE__ */ jsx(
            ArvoIconButton,
            {
              size: "sm",
              variant: "tertiary",
              icon: action.icon,
              tooltip,
              isDisabled: isDisabled || action.isDisabled,
              isLoading: action.isLoading,
              isSelected: action.isSelected,
              onClick: () => {
                var _a;
                if (isDisabled || action.isDisabled) return;
                (_a = action.onClick) == null ? void 0 : _a.call(action);
              }
            }
          )
        }
      );
    }
    case "dropdown": {
      const dd = action;
      const tooltip = dd.tooltip ?? dd.label ?? dd.id;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: baseClass,
          "data-action-id": dd.id,
          "data-action-type": dd.type,
          children: /* @__PURE__ */ jsx(
            ArvoDropdownIconButton,
            {
              size: "sm",
              variant: "tertiary",
              icon: dd.icon,
              tooltip,
              items: dd.items,
              placement: dd.placement ?? "bottom-end",
              isDisabled: isDisabled || dd.isDisabled,
              isLoading: dd.isLoading,
              onSelect: (item) => {
                var _a;
                if (isDisabled || dd.isDisabled) return;
                (_a = dd.onSelect) == null ? void 0 : _a.call(dd, item.id);
              }
            }
          )
        }
      );
    }
    case "split": {
      const sp = action;
      const tooltip = sp.tooltip ?? sp.label ?? sp.id;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: baseClass,
          "data-action-id": sp.id,
          "data-action-type": sp.type,
          children: /* @__PURE__ */ jsx(
            ArvoSplitIconButton,
            {
              size: "sm",
              variant: "tertiary",
              icon: sp.icon,
              tooltip,
              triggerLabel: sp.triggerLabel,
              items: sp.items,
              placement: sp.placement ?? "bottom-end",
              isDisabled: isDisabled || sp.isDisabled,
              isActionDisabled: sp.isActionDisabled,
              isTriggerDisabled: sp.isTriggerDisabled,
              isLoading: sp.isLoading,
              onAction: () => {
                var _a;
                if (isDisabled || sp.isDisabled) return;
                (_a = sp.onClick) == null ? void 0 : _a.call(sp);
              },
              onSelect: (item) => {
                var _a;
                if (isDisabled || sp.isDisabled) return;
                (_a = sp.onSelect) == null ? void 0 : _a.call(sp, item.id);
              }
            }
          )
        }
      );
    }
    case "switch":
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: baseClass,
          "data-action-id": action.id,
          "data-action-type": action.type,
          "aria-label": action.label,
          children: /* @__PURE__ */ jsx(
            ArvoSwitch,
            {
              isChecked: action.isChecked,
              defaultChecked: action.defaultChecked,
              isDisabled: isDisabled || action.isDisabled,
              isReadOnly: action.isReadOnly,
              isLoading: action.isLoading,
              "aria-label": action.label,
              onChange: ({ isChecked }) => {
                var _a;
                if (isDisabled || action.isDisabled) return;
                (_a = action.onChange) == null ? void 0 : _a.call(action, isChecked);
              }
            }
          )
        }
      );
    case "checkbox":
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: baseClass,
          "data-action-id": action.id,
          "data-action-type": action.type,
          "aria-label": action.label,
          children: /* @__PURE__ */ jsx(
            ArvoCheckbox,
            {
              size: "sm",
              isChecked: action.isChecked,
              defaultChecked: action.defaultChecked,
              isIndeterminate: action.isIndeterminate,
              isDisabled: isDisabled || action.isDisabled,
              isReadOnly: action.isReadOnly,
              isLoading: action.isLoading,
              "aria-label": action.label,
              onChange: ({ isChecked }) => {
                var _a;
                if (isDisabled || action.isDisabled) return;
                (_a = action.onChange) == null ? void 0 : _a.call(action, isChecked);
              }
            }
          )
        }
      );
  }
}
function resolvePanelInfoRole(type) {
  return type === "negative" || type === "warning" || type === "block" ? "alert" : "status";
}
function PanelInfo({ config, message, block }) {
  const type = config.type ?? "info";
  const role = resolvePanelInfoRole(type);
  return /* @__PURE__ */ jsx("div", { className: `${block}__info`, children: /* @__PURE__ */ jsx(ArvoMessageAlert, { type, role, message }) });
}
function SkeletonRows({ block }) {
  const widths = ["wide", "medium", "narrow", "wide", "medium"];
  return /* @__PURE__ */ jsx("div", { className: `${block}__skeleton`, children: widths.map((w, i) => /* @__PURE__ */ jsx("div", { className: `${block}__skeleton__row ${block}__skeleton__row--${w}` }, i)) });
}
function EmptyState({ block, variant, onClearSearch }) {
  return /* @__PURE__ */ jsxs("div", { className: `${block}__empty`, children: [
    /* @__PURE__ */ jsx("div", { className: `${block}__empty-illus`, "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("div", { className: `${block}__empty-title`, children: variant === "no-data" ? "No data" : "No results found" }),
    /* @__PURE__ */ jsx("div", { className: `${block}__empty-msg`, children: variant === "no-data" ? "There are no items to display." : "Try adjusting your search terms." }),
    variant === "no-results" && onClearSearch && /* @__PURE__ */ jsx("div", { className: `${block}__empty-action`, children: /* @__PURE__ */ jsx(
      ArvoButton,
      {
        variant: "outline",
        size: "sm",
        label: "Clear search",
        onClick: onClearSearch
      }
    ) })
  ] });
}
function renderDefaultItem(item, block) {
  const secondary = item.secondaryLabel ?? item.description;
  const hasAvatar = !!item.avatarUrl;
  const hasIcon = !hasAvatar && !!item.icon;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hasAvatar && /* @__PURE__ */ jsx(
      "img",
      {
        className: `${block}__item__avatar`,
        src: item.avatarUrl,
        alt: ""
      }
    ),
    hasIcon && /* @__PURE__ */ jsx(
      "i",
      {
        className: `o9con-${item.icon} ${block}__item__ico`,
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `${block}__item__txt`, children: [
      /* @__PURE__ */ jsx("span", { className: `${block}__item__lbl`, children: item.label }),
      secondary && /* @__PURE__ */ jsx("span", { className: `${block}__item__secondary`, children: secondary })
    ] })
  ] });
}
function PanelShellInner(props, ref) {
  var _a;
  const {
    parentBlock: block,
    pinSlot,
    title: titleProp,
    hasHeader = true,
    hasBackButton = false,
    onBack,
    headerActions: headerActionsProp,
    stickyHeader: stickyHeaderProp = false,
    items: itemsProp,
    getItemId = (item) => item.id,
    filterKeys,
    getItemSearchText,
    renderItem,
    itemsRole = "list",
    actions: actionsProp = false,
    isClosable = false,
    onClose,
    isLoading: isLoadingProp = false,
    isDisabled: isDisabledProp = false,
    isPinnableCount = 0,
    isClosableCount,
    children,
    className,
    searchQuery: searchQueryProp,
    defaultSearchQuery = "",
    onSearchChange,
    onItemActivate,
    onTabSelect,
    titleLeading,
    titleTrailing,
    richHeader
  } = props;
  const isLoading = isLoadingProp === true;
  const [titleState, setTitleState] = useState(titleProp ?? null);
  const [headerActionsState, setHeaderActionsState] = useState(headerActionsProp ?? []);
  const [stickyState, setStickyState] = useState(stickyHeaderProp);
  const [actionsState, setActionsState] = useState(actionsProp);
  const footerActionsRef = useRef(null);
  const [itemsState, setItemsState] = useState(itemsProp);
  const [loadingState, setLoadingState] = useState(isLoading);
  const [disabledState, setDisabledState] = useState(isDisabledProp);
  useEffect(() => {
    setTitleState(titleProp ?? null);
  }, [titleProp]);
  useEffect(() => {
    setHeaderActionsState(headerActionsProp ?? []);
  }, [headerActionsProp]);
  useEffect(() => {
    setStickyState(stickyHeaderProp);
  }, [stickyHeaderProp]);
  useEffect(() => {
    setActionsState(actionsProp);
  }, [actionsProp]);
  useEffect(() => {
    setItemsState(itemsProp);
  }, [itemsProp]);
  useEffect(() => {
    setLoadingState(isLoading);
  }, [isLoading]);
  useEffect(() => {
    setDisabledState(isDisabledProp);
  }, [isDisabledProp]);
  const footerActionsKey = !loadingState && actionsState && actionsState.length > 0 ? actionsState.map((a) => `${a.id}|${a.label ?? ""}|${a.isIconOnly ? "1" : "0"}`).join("//") : null;
  useEffect(() => {
    if (footerActionsKey == null) return;
    const host = footerActionsRef.current;
    if (!host) return;
    const fit = attachOverlayFooterFit(host, { gap: 8 });
    return () => fit.destroy();
  }, [footerActionsKey]);
  const [searchQuery, setSearchQuery] = useControllableState(
    searchQueryProp,
    defaultSearchQuery
  );
  const [selectedTabId, setSelectedTabId] = useControllableState(
    void 0,
    null
  );
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const titleRef = useRef(null);
  const tabRovingRef = useRef(null);
  const titleId = useMemo(
    () => `${block}-title-${Math.random().toString(36).slice(2, 9)}`,
    [block]
  );
  useEffect(() => {
    if (itemsState !== void 0 && children && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      console.warn(
        `[PanelShell] Both "items" and "children" were provided. When "items" is set, "children" is ignored.`
      );
    }
  }, [itemsState, children]);
  const closableCount = isClosableCount ?? (isClosable ? 1 : 0);
  const validActionCount = useMemo(
    () => headerActionsState.filter((a) => validateHeaderAction(a)).length,
    [headerActionsState]
  );
  useEffect(() => {
    const total = validActionCount + isPinnableCount + closableCount;
    if (total > 4 && typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
      console.warn(
        `[PanelShell] Total header actions (${total}) exceeds cap of 4. Computed across headerActions (${validActionCount}) + isPinnable (${isPinnableCount}) + isClosable (${closableCount}).`
      );
    }
  }, [validActionCount, isPinnableCount, closableCount]);
  const hasItems = itemsState !== void 0;
  const filteredItems = useMemo(() => {
    if (itemsState === void 0) return [];
    if (!searchQuery) return itemsState;
    return runItemFilter(itemsState, searchQuery, {
      keys: filterKeys,
      getItemSearchText
    });
  }, [itemsState, searchQuery, filterKeys, getItemSearchText]);
  const emptyState = useMemo(() => {
    if (!hasItems) return null;
    if (itemsState.length === 0) return "no-data";
    if (filteredItems.length === 0 && searchQuery) return "no-results";
    return null;
  }, [hasItems, itemsState, filteredItems, searchQuery]);
  useEffect(() => {
    if (!listRef.current || !hasItems || loadingState) return;
    const itemEls = Array.from(
      listRef.current.querySelectorAll(`.${block}__item`)
    );
    if (itemEls.length === 0) return;
    const roving = createTabRoving();
    roving.activate({
      container: listRef.current,
      items: itemEls,
      orientation: "vertical",
      wrap: true
    });
    tabRovingRef.current = roving;
    return () => {
      roving.deactivate();
      tabRovingRef.current = null;
    };
  }, [block, hasItems, filteredItems, loadingState]);
  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);
      if (hasItems) {
        const matched = runItemFilter(itemsState, value, {
          keys: filterKeys,
          getItemSearchText
        });
        onSearchChange == null ? void 0 : onSearchChange(value, matched.length);
      } else {
        onSearchChange == null ? void 0 : onSearchChange(value, null);
      }
    },
    [setSearchQuery, hasItems, itemsState, filterKeys, getItemSearchText, onSearchChange]
  );
  const handleClearSearch = useCallback(() => {
    var _a2;
    setSearchQuery("");
    onSearchChange == null ? void 0 : onSearchChange("", (itemsState == null ? void 0 : itemsState.length) ?? 0);
    const inputEl = (_a2 = searchRef.current) == null ? void 0 : _a2.querySelector(
      "input, textarea"
    );
    inputEl == null ? void 0 : inputEl.focus();
  }, [setSearchQuery, onSearchChange, itemsState]);
  const stickyConfig = stickyState ? stickyState : null;
  const infoMessage = useMemo(() => {
    if (!(stickyConfig == null ? void 0 : stickyConfig.info)) return null;
    const infoCfg = stickyConfig.info;
    if (infoCfg.showMatchCount && hasItems) {
      return formatMatchCountMessage(filteredItems.length, infoCfg.matchCountTemplate);
    }
    return infoCfg.message ?? null;
  }, [stickyConfig, hasItems, filteredItems]);
  const showInfo = useMemo(() => {
    if (!(stickyConfig == null ? void 0 : stickyConfig.info) || !infoMessage) return false;
    if (stickyConfig.info.showWhen === "filtered") return !!searchQuery;
    return true;
  }, [stickyConfig, infoMessage, searchQuery]);
  const tabsForTabstrip = useMemo(() => {
    if (!(stickyConfig == null ? void 0 : stickyConfig.tabs)) return [];
    return stickyConfig.tabs.map((t) => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      isDisabled: t.isDisabled
    }));
  }, [stickyConfig]);
  useEffect(() => {
    var _a2;
    if (!((_a2 = stickyConfig == null ? void 0 : stickyConfig.tabs) == null ? void 0 : _a2.length)) return;
    if (selectedTabId !== null) return;
    const first = stickyConfig.tabs.find((t) => !t.isDisabled);
    if (first) setSelectedTabId(first.id);
  }, [stickyConfig, selectedTabId, setSelectedTabId]);
  const searchCfg = useMemo(() => {
    const raw = stickyConfig == null ? void 0 : stickyConfig.search;
    if (!raw) return null;
    return raw === true ? {} : raw;
  }, [stickyConfig]);
  const searchCounter = useMemo(() => {
    if (!(searchCfg == null ? void 0 : searchCfg.showCounter)) return null;
    if (!hasItems) return null;
    return { current: filteredItems.length, total: itemsState.length };
  }, [searchCfg, hasItems, filteredItems, itemsState]);
  const searchPlaceholder = (searchCfg == null ? void 0 : searchCfg.placeholder) ?? "Search";
  const searchShortcut = searchCfg == null ? void 0 : searchCfg.shortcut;
  const hostClasses = useMemo(() => {
    const cls = [];
    if (loadingState) cls.push("loading");
    if (disabledState) cls.push("is-disabled");
    if (emptyState === "no-data") cls.push("no-data");
    if (emptyState === "no-results") cls.push("no-results");
    if (stickyConfig == null ? void 0 : stickyConfig.banner) cls.push(`${block}--with-banner`);
    if ((stickyConfig == null ? void 0 : stickyConfig.tabs) && stickyConfig.tabs.length > 0) cls.push(`${block}--with-tabs`);
    if (stickyConfig == null ? void 0 : stickyConfig.search) cls.push(`${block}--with-search`);
    if (stickyConfig == null ? void 0 : stickyConfig.info) cls.push(`${block}--with-info`);
    if (actionsState && actionsState.length > 0) cls.push(`${block}--with-footer`);
    if (className) cls.push(className);
    return cls.join(" ");
  }, [block, loadingState, disabledState, emptyState, stickyConfig, actionsState, className]);
  useImperativeHandle(ref, () => ({
    setItems(next) {
      setItemsState(next);
    },
    setStickyHeader(config) {
      setStickyState(config);
    },
    setHeaderActions(next) {
      setHeaderActionsState(next);
    },
    setActions(next) {
      setActionsState(next);
    },
    setInfo(config) {
      setStickyState((prev) => prev ? { ...prev, info: config } : prev);
    },
    updateAction(id, patch) {
      setHeaderActionsState((prev) => {
        const idx = prev.findIndex((a) => a.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...patch };
          return next;
        }
        return prev;
      });
      setActionsState((prev) => {
        if (!prev) return prev;
        const idx = prev.findIndex((a) => a.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], ...patch };
          return next;
        }
        return prev;
      });
    },
    search(query) {
      if (query === void 0) return searchQuery;
      setSearchQuery(query);
    },
    selectedTab(id) {
      if (id === void 0) return selectedTabId;
      setSelectedTabId(id);
    },
    setTitle(next) {
      setTitleState(next);
    },
    loading(state) {
      if (state === void 0) return loadingState;
      setLoadingState(state === true);
    },
    disabled(state) {
      if (state === void 0) return disabledState;
      setDisabledState(state);
    },
    focus(target) {
      var _a2;
      const t = target ?? "first";
      if (t === "search" && searchRef.current) {
        const input = searchRef.current.querySelector("input, textarea");
        input == null ? void 0 : input.focus();
        return;
      }
      if (t === "title" && titleRef.current) {
        titleRef.current.setAttribute("tabindex", "-1");
        titleRef.current.focus();
        return;
      }
      if (t === "list" && listRef.current) {
        const first = listRef.current.querySelector(`.${block}__item`);
        if (first) {
          first.focus();
          (_a2 = tabRovingRef.current) == null ? void 0 : _a2.setActiveItem(0);
        }
        return;
      }
      if (searchRef.current) {
        const input = searchRef.current.querySelector("input, textarea");
        if (input) {
          input.focus();
          return;
        }
      }
      if (titleRef.current) {
        titleRef.current.setAttribute("tabindex", "-1");
        titleRef.current.focus();
      }
    },
    getTitleId() {
      if (!hasHeader) return null;
      if (titleState == null || titleState === "") return null;
      return titleId;
    }
  }), [block, hasHeader, titleId, titleState, searchQuery, selectedTabId, loadingState, disabledState, setSearchQuery, setSelectedTabId]);
  const wrapperClasses = ["arvo-panel-shell", hostClasses].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("div", { className: wrapperClasses, "aria-busy": loadingState || void 0, children: [
    hasHeader && /* @__PURE__ */ jsxs("div", { className: `${block}__hdr`, children: [
      /* @__PURE__ */ jsxs("div", { className: `${block}__hdr-lft`, children: [
        hasBackButton && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            className: `${block}__back`,
            size: "sm",
            variant: "tertiary",
            icon: "arrow-left",
            tooltip: "Back",
            isDisabled: disabledState,
            onClick: () => {
              if (!disabledState) onBack == null ? void 0 : onBack();
            }
          }
        ),
        titleLeading && /* @__PURE__ */ jsx("span", { className: `${block}__title-leading`, children: titleLeading }),
        /* @__PURE__ */ jsx(
          "span",
          {
            ref: titleRef,
            id: titleId,
            className: `${block}__title`,
            children: titleState
          }
        ),
        titleTrailing && /* @__PURE__ */ jsx("span", { className: `${block}__title-trailing`, children: titleTrailing })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${block}__hdr-actions`, children: [
        headerActionsState.filter((a) => validateHeaderAction(a)).map((action) => /* @__PURE__ */ jsx(
          HeaderAction,
          {
            action,
            block,
            isDisabled: disabledState
          },
          action.id
        )),
        pinSlot,
        isClosable && /* @__PURE__ */ jsx(
          ArvoIconButton,
          {
            className: `${block}__close`,
            size: "sm",
            variant: "tertiary",
            icon: "close",
            tooltip: "Close",
            isDisabled: disabledState,
            onClick: () => {
              if (!disabledState) onClose == null ? void 0 : onClose();
            }
          }
        )
      ] })
    ] }),
    richHeader,
    stickyConfig && !loadingState && /* @__PURE__ */ jsxs("div", { className: `${block}__sticky`, children: [
      stickyConfig.banner && /* @__PURE__ */ jsx("div", { className: `${block}__banner`, children: /* @__PURE__ */ jsx(
        ArvoBannerAlert,
        {
          type: stickyConfig.banner.type,
          title: stickyConfig.banner.title ?? void 0,
          message: stickyConfig.banner.message,
          isCompact: stickyConfig.banner.isCompact,
          isDismissible: stickyConfig.banner.isDismissible ?? false,
          onDismiss: stickyConfig.banner.onDismiss
        }
      ) }),
      stickyConfig.tabs && stickyConfig.tabs.length > 0 && /* @__PURE__ */ jsx("div", { className: `${block}__tabs`, children: /* @__PURE__ */ jsx(
        ArvoTabstrip,
        {
          variant: "primary",
          size: "sm",
          isFullWidth: true,
          tabs: tabsForTabstrip,
          selectedId: selectedTabId,
          isDisabled: disabledState,
          onSelect: (detail) => {
            setSelectedTabId(detail.id);
            onTabSelect == null ? void 0 : onTabSelect(detail.id);
          }
        }
      ) }),
      searchCfg && /* @__PURE__ */ jsx(
        "div",
        {
          ref: searchRef,
          className: `${block}__search`,
          onKeyDown: (e) => {
            var _a2, _b;
            if (e.key !== "ArrowDown") return;
            const firstItem = (_a2 = listRef.current) == null ? void 0 : _a2.querySelector(
              `.${block}__item`
            );
            if (firstItem) {
              e.preventDefault();
              firstItem.focus();
              (_b = tabRovingRef.current) == null ? void 0 : _b.setActiveItem(0);
            }
          },
          children: searchCfg.variant === "advance-search" ? /* @__PURE__ */ jsx(
            ArvoAdvanceSearch,
            {
              ...searchCfg.advanceSearchProps,
              variant: ((_a = searchCfg.advanceSearchProps) == null ? void 0 : _a.variant) ?? "filterBy",
              value: searchQuery,
              placeholder: searchPlaceholder,
              shortcut: searchShortcut ?? null,
              isFullWidth: true,
              isDisabled: disabledState,
              onChange: handleSearchChange,
              onClear: handleClearSearch,
              "aria-label": searchPlaceholder
            }
          ) : /* @__PURE__ */ jsx(
            ArvoSearch,
            {
              variant: "filter",
              value: searchQuery,
              placeholder: searchPlaceholder,
              shortcut: searchShortcut,
              isFullWidth: true,
              isDisabled: disabledState,
              counter: searchCounter,
              onSearch: handleSearchChange,
              onChange: handleSearchChange,
              onClear: handleClearSearch,
              "aria-label": searchPlaceholder
            }
          )
        }
      ),
      showInfo && stickyConfig.info && infoMessage && /* @__PURE__ */ jsx(
        PanelInfo,
        {
          config: stickyConfig.info,
          message: infoMessage,
          block
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `${block}__body`, children: loadingState ? /* @__PURE__ */ jsx(SkeletonRows, { block }) : hasItems ? emptyState ? /* @__PURE__ */ jsx(
      EmptyState,
      {
        block,
        variant: emptyState,
        onClearSearch: emptyState === "no-results" ? handleClearSearch : void 0
      }
    ) : /* @__PURE__ */ jsx(
      "div",
      {
        ref: listRef,
        className: `${block}__list`,
        role: itemsRole,
        tabIndex: -1,
        children: filteredItems.map((item) => {
          const defaultItem = item;
          const itemClasses = [
            `${block}__item`,
            defaultItem.isActive ? "active" : "",
            defaultItem.isDisabled ? "is-disabled" : ""
          ].filter(Boolean).join(" ");
          const itemDisabled = !!defaultItem.isDisabled;
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: itemClasses,
              "data-item-id": getItemId(item),
              tabIndex: -1,
              role: "option",
              "aria-disabled": itemDisabled || void 0,
              onClick: () => {
                if (disabledState || itemDisabled) return;
                onItemActivate == null ? void 0 : onItemActivate(getItemId(item), item);
              },
              onKeyDown: (e) => {
                var _a2;
                if (e.key === "Enter" && !disabledState && !itemDisabled) {
                  e.preventDefault();
                  onItemActivate == null ? void 0 : onItemActivate(getItemId(item), item);
                }
                if (e.key === "ArrowUp") {
                  const itemEls = (_a2 = listRef.current) == null ? void 0 : _a2.querySelectorAll(`.${block}__item`);
                  if (itemEls) {
                    const idx = Array.from(itemEls).indexOf(e.currentTarget);
                    if (idx === 0 && searchRef.current) {
                      e.preventDefault();
                      const input = searchRef.current.querySelector("input, textarea");
                      input == null ? void 0 : input.focus();
                    }
                  }
                }
              },
              children: renderItem ? renderItem(item) : renderDefaultItem(defaultItem, block)
            },
            getItemId(item)
          );
        })
      }
    ) : children }),
    (() => {
      if (loadingState || !actionsState || actionsState.length === 0) return null;
      const footerActions = clampFooterActions(actionsState, {
        componentName: `panel-shell (${block})`
      });
      if (footerActions.length === 0) return null;
      return /* @__PURE__ */ jsx("div", { className: `${block}__footer`, children: /* @__PURE__ */ jsx("div", { ref: footerActionsRef, className: `${block}__footer-actions`, children: footerActions.map((action) => (
        // ArvoButton no longer accepts a tooltip prop (per the design
        // system tooltip standard). action.tooltip is preserved on the
        // ArvoPanelAction type for backward compat but ignored here --
        // consumers wrap the action with ArvoTooltip if needed.
        /* @__PURE__ */ jsx(
          ArvoButton,
          {
            "data-action-id": action.id,
            "data-icon-only": action.isIconOnly ? "true" : void 0,
            size: action.size ?? "md",
            variant: action.variant ?? "secondary",
            label: action.label,
            icon: action.icon,
            isDisabled: disabledState || action.isDisabled || void 0,
            isLoading: action.isLoading,
            onClick: () => {
              var _a2;
              if (disabledState || action.isDisabled) return;
              (_a2 = action.onClick) == null ? void 0 : _a2.call(action);
            }
          },
          action.id
        )
      )) }) });
    })()
  ] });
}
const PanelShell = forwardRef(PanelShellInner);
export {
  HeaderAction,
  PanelShell
};
//# sourceMappingURL=index105.js.map
