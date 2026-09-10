import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { ArvoButton } from "./index16.js";
import ArvoLink from "./index32.js";
const KNOWN_ILLUSTRATIONS = {
  "no-results": "o9illus-no-results-found",
  "no-data": "o9illus-no-filters-found"
};
const BLOCK = "arvo-empty";
const DEFAULT_TITLE = "No results found";
const DEFAULT_MESSAGE = "Adjust your filter search query.";
function resolveIllustrationClass(illustration) {
  if (illustration === "no-results" || illustration === "no-data") {
    return KNOWN_ILLUSTRATIONS[illustration];
  }
  if (illustration.startsWith("o9illus-")) {
    return illustration;
  }
  return `o9illus-${illustration}`;
}
const ArvoEmptyState = forwardRef(
  function ArvoEmptyState2({
    size = "md",
    orientation = "vertical",
    illustration = "no-results",
    title = DEFAULT_TITLE,
    message = DEFAULT_MESSAGE,
    primaryAction,
    secondaryAction,
    link,
    id,
    className,
    isAnimated = true
  }, ref) {
    const illusClass = resolveIllustrationClass(illustration);
    const classes = [
      BLOCK,
      `${BLOCK}--${size}`,
      `${BLOCK}--${orientation}`,
      !isAnimated && `${BLOCK}--no-anim`,
      className
    ].filter(Boolean).join(" ");
    const hasActions = !!(primaryAction || secondaryAction || link);
    const hasButtons = !!(primaryAction || secondaryAction);
    const hasMessage = !!(title || message);
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        id,
        className: classes,
        role: "status",
        "aria-live": "polite",
        children: /* @__PURE__ */ jsxs("div", { className: `${BLOCK}__figure`, children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `${BLOCK}__illus o9illus ${illusClass}`,
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: `${BLOCK}__body`, children: [
            hasMessage && /* @__PURE__ */ jsxs("div", { className: `${BLOCK}__msg`, children: [
              title && /* @__PURE__ */ jsx("span", { className: `${BLOCK}__title`, children: title }),
              message && /* @__PURE__ */ jsx("span", { className: `${BLOCK}__message`, children: message })
            ] }),
            hasActions && /* @__PURE__ */ jsxs("div", { className: `${BLOCK}__actions`, children: [
              hasButtons && /* @__PURE__ */ jsxs("div", { className: `${BLOCK}__action-row`, children: [
                secondaryAction && /* @__PURE__ */ jsx(
                  ArvoButton,
                  {
                    label: secondaryAction.label,
                    icon: secondaryAction.icon,
                    variant: secondaryAction.variant ?? "outline",
                    size: "sm",
                    isDisabled: secondaryAction.isDisabled,
                    onClick: secondaryAction.onClick
                  }
                ),
                primaryAction && /* @__PURE__ */ jsx(
                  ArvoButton,
                  {
                    label: primaryAction.label,
                    icon: primaryAction.icon,
                    variant: primaryAction.variant ?? "primary",
                    size: "sm",
                    isDisabled: primaryAction.isDisabled,
                    onClick: primaryAction.onClick
                  }
                )
              ] }),
              link && /* @__PURE__ */ jsx("span", { className: `${BLOCK}__link`, children: /* @__PURE__ */ jsx(
                ArvoLink,
                {
                  label: link.label,
                  href: link.href,
                  onClick: link.onClick,
                  icon: link.icon ?? "add-attachment",
                  isExternal: link.isExternal,
                  size: "sm"
                }
              ) })
            ] })
          ] })
        ] })
      }
    );
  }
);
export {
  KNOWN_ILLUSTRATIONS,
  ArvoEmptyState as default
};
//# sourceMappingURL=index88.js.map
