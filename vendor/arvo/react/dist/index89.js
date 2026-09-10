import { jsx, Fragment } from "react/jsx-runtime";
import React from "react";
import { renderInlineContent } from "@arvo/core";
function withKeys(children) {
  return children.map(
    (child, i) => React.isValidElement(child) ? React.cloneElement(child, { key: i }) : child
  );
}
const reactInlineAdapter = {
  fragment(children) {
    return /* @__PURE__ */ jsx(Fragment, { children: withKeys(children) });
  },
  text(value) {
    return value;
  },
  em(children) {
    return /* @__PURE__ */ jsx("em", { className: "arvo-inline__em", children: withKeys(children) });
  },
  strong(children) {
    return /* @__PURE__ */ jsx("strong", { className: "arvo-inline__strong", children: withKeys(children) });
  },
  link(props, label) {
    return /* @__PURE__ */ jsx(
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
    return /* @__PURE__ */ jsx("code", { className: "arvo-inline__code", children: value });
  },
  kbd(value) {
    return /* @__PURE__ */ jsx("kbd", { className: "arvo-inline__kbd", children: value });
  },
  abbr(value, title) {
    return /* @__PURE__ */ jsx("abbr", { className: "arvo-inline__abbr", title, children: value });
  },
  time(value, dateTime) {
    return /* @__PURE__ */ jsx("time", { className: "arvo-inline__time", dateTime, children: value });
  },
  sup(value) {
    return /* @__PURE__ */ jsx("sup", { className: "arvo-inline__sup", children: value });
  },
  sub(value) {
    return /* @__PURE__ */ jsx("sub", { className: "arvo-inline__sub", children: value });
  },
  br() {
    return /* @__PURE__ */ jsx("br", {});
  }
};
function renderInlineContentReact(content, options) {
  return renderInlineContent(content, reactInlineAdapter, options);
}
export {
  reactInlineAdapter,
  renderInlineContentReact
};
//# sourceMappingURL=index89.js.map
