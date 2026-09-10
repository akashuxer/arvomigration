"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const PanelBase = require("./index99.cjs");
const utils = require("@arvo/utils");
const Nav = require("./index38.cjs");
const ArvoNavPanel = React.forwardRef(
  function ArvoNavPanel2(props, ref) {
    const {
      items,
      activeId,
      defaultActiveId,
      onActivate,
      navProps,
      instanceRef,
      placement = "left",
      isCompact = false,
      size = "md",
      className,
      ...rest
    } = props;
    const baseHandleRef = React.useRef(null);
    const navHostRef = React.useRef(null);
    const dispatchNavActivate = React.useCallback((id) => {
      var _a;
      (_a = navHostRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("pnl:nav-activate", {
          bubbles: true,
          detail: { id }
        })
      );
    }, []);
    const handleNavSelect = React.useCallback(
      (detail) => {
        onActivate == null ? void 0 : onActivate({ id: detail.id, item: detail.item });
        dispatchNavActivate(detail.id);
      },
      [onActivate, dispatchNavActivate]
    );
    const body = React.useCallback(
      (ctx) => {
        const query = ctx.searchQuery ?? "";
        const keys = ctx.searchKeys ?? ["label"];
        const filtered = query.length > 0 ? utils.runItemFilter(
          items,
          query,
          {
            keys,
            getItemSearchText: ctx.getItemSearchText
          }
        ) : items;
        return /* @__PURE__ */ jsxRuntime.jsx(
          Nav.ArvoNav,
          {
            ...navProps,
            ref: navHostRef,
            size,
            isCompact,
            items: filtered,
            selectedId: activeId ?? void 0,
            defaultSelectedId: activeId === void 0 ? defaultActiveId : void 0,
            onSelect: handleNavSelect
          }
        );
      },
      [
        items,
        navProps,
        activeId,
        defaultActiveId,
        size,
        isCompact,
        handleNavSelect
      ]
    );
    const extraHostClasses = React.useMemo(() => {
      const classes = [`arvo-pnl--size-${size}`];
      if (isCompact) classes.push("arvo-pnl--compact");
      return classes;
    }, [size, isCompact]);
    const compactSize = React.useMemo(() => {
      if (!isCompact) return null;
      const w = size === "sm" ? 32 : size === "lg" ? 48 : 40;
      return { defaultSize: w, minSize: w, maxSize: w };
    }, [isCompact, size]);
    React.useImperativeHandle(
      instanceRef,
      () => ({
        open: () => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.open();
        },
        close: (reason) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.close(reason);
        },
        toggle: () => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.toggle();
        },
        isOpen: () => {
          var _a;
          return ((_a = baseHandleRef.current) == null ? void 0 : _a.isOpen()) ?? false;
        },
        pinned(value) {
          var _a, _b;
          if (value === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.pinned();
          (_b = baseHandleRef.current) == null ? void 0 : _b.pinned(value);
        },
        setDisplayMode: (mode) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setDisplayMode(mode);
        },
        setStickyHeader: (config) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setStickyHeader(config);
        },
        setHeaderActions: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setHeaderActions(next);
        },
        setActions: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setActions(next);
        },
        setTitle: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setTitle(next);
        },
        setIcon: (next) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.setIcon(next);
        },
        search(query) {
          var _a, _b;
          if (query === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.search();
          (_b = baseHandleRef.current) == null ? void 0 : _b.search(query);
        },
        selectedTab(id) {
          var _a, _b;
          if (id === void 0)
            return ((_a = baseHandleRef.current) == null ? void 0 : _a.selectedTab()) ?? null;
          (_b = baseHandleRef.current) == null ? void 0 : _b.selectedTab(id);
        },
        loading(state) {
          var _a, _b;
          if (state === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.loading();
          (_b = baseHandleRef.current) == null ? void 0 : _b.loading(state);
        },
        disabled(state) {
          var _a, _b;
          if (state === void 0)
            return (_a = baseHandleRef.current) == null ? void 0 : _a.disabled();
          (_b = baseHandleRef.current) == null ? void 0 : _b.disabled(state);
        },
        focus: (target) => {
          var _a;
          return (_a = baseHandleRef.current) == null ? void 0 : _a.focus(target);
        }
      }),
      []
    );
    return /* @__PURE__ */ jsxRuntime.jsx(
      PanelBase.default,
      {
        ...rest,
        ...compactSize ?? {},
        ref,
        placement,
        panelType: "navigation",
        className,
        extraHostClasses,
        body,
        instanceRef: baseHandleRef
      }
    );
  }
);
exports.default = ArvoNavPanel;
//# sourceMappingURL=index74.cjs.map
