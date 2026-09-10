"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const core = require("@arvo/core");
function withKeys(children) {
  return children.map(
    (child, i) => React.isValidElement(child) ? React.cloneElement(child, { key: i }) : child
  );
}
const reactInlineAdapter = {
  fragment(children) {
    return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: withKeys(children) });
  },
  text(value) {
    return value;
  },
  em(children) {
    return /* @__PURE__ */ jsxRuntime.jsx("em", { className: "arvo-inline__em", children: withKeys(children) });
  },
  strong(children) {
    return /* @__PURE__ */ jsxRuntime.jsx("strong", { className: "arvo-inline__strong", children: withKeys(children) });
  },
  link(props, label) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "a",
      {
        className: "arvo-inline__link",
        href: props.href,
        target: props.target,
        rel: props.rel,
        "aria-label": props.ariaLabel,
        children: label
      }
    );
  },
  code(value) {
    return /* @__PURE__ */ jsxRuntime.jsx("code", { className: "arvo-inline__code", children: value });
  },
  kbd(value) {
    return /* @__PURE__ */ jsxRuntime.jsx("kbd", { className: "arvo-inline__kbd", children: value });
  },
  abbr(value, title) {
    return /* @__PURE__ */ jsxRuntime.jsx("abbr", { className: "arvo-inline__abbr", title, children: value });
  },
  time(value, dateTime) {
    return /* @__PURE__ */ jsxRuntime.jsx("time", { className: "arvo-inline__time", dateTime, children: value });
  },
  sup(value) {
    return /* @__PURE__ */ jsxRuntime.jsx("sup", { className: "arvo-inline__sup", children: value });
  },
  sub(value) {
    return /* @__PURE__ */ jsxRuntime.jsx("sub", { className: "arvo-inline__sub", children: value });
  },
  br() {
    return /* @__PURE__ */ jsxRuntime.jsx("br", {});
  }
};
function renderInlineContentReact(content, options) {
  return core.renderInlineContent(content, reactInlineAdapter, options);
}
exports.reactInlineAdapter = reactInlineAdapter;
exports.renderInlineContentReact = renderInlineContentReact;
//# sourceMappingURL=index89.cjs.map
