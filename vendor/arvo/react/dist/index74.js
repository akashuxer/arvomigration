import { jsx } from "react/jsx-runtime";
import { forwardRef, useRef, useCallback, useMemo, useImperativeHandle } from "react";
import PanelBase from "./index99.js";
import { runItemFilter } from "@arvo/utils";
import { ArvoNav } from "./index38.js";
const ArvoNavPanel = forwardRef(
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
    const baseHandleRef = useRef(null);
    const navHostRef = useRef(null);
    const dispatchNavActivate = useCallback((id) => {
      var _a;
      (_a = navHostRef.current) == null ? void 0 : _a.dispatchEvent(
        new CustomEvent("pnl:nav-activate", {
          bubbles: true,
          detail: { id }
        })
      );
    }, []);
    const handleNavSelect = useCallback(
      (detail) => {
        onActivate == null ? void 0 : onActivate({ id: detail.id, item: detail.item });
        dispatchNavActivate(detail.id);
      },
      [onActivate, dispatchNavActivate]
    );
    const body = useCallback(
      (ctx) => {
        const query = ctx.searchQuery ?? "";
        const keys = ctx.searchKeys ?? ["label"];
        const filtered = query.length > 0 ? runItemFilter(
          items,
          query,
          {
            keys,
            getItemSearchText: ctx.getItemSearchText
          }
        ) : items;
        return /* @__PURE__ */ jsx(
          ArvoNav,
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
    const extraHostClasses = useMemo(() => {
      const classes = [`arvo-pnl--size-${size}`];
      if (isCompact) classes.push("arvo-pnl--compact");
      return classes;
    }, [size, isCompact]);
    const compactSize = useMemo(() => {
      if (!isCompact) return null;
      const w = size === "sm" ? 32 : size === "lg" ? 48 : 40;
      return { defaultSize: w, minSize: w, maxSize: w };
    }, [isCompact, size]);
    useImperativeHandle(
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
    return /* @__PURE__ */ jsx(
      PanelBase,
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
export {
  ArvoNavPanel as default
};
//# sourceMappingURL=index74.js.map
