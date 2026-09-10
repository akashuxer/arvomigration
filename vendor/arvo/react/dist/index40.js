import { jsx } from "react/jsx-runtime";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { resolveInitials } from "@arvo/core";
const VALID_VARIANTS = [
  "image",
  "initials",
  "icon",
  "logo",
  "o9logo",
  "novai"
];
const VALID_SIZES = ["xs", "sm", "md", "lg", "xl"];
const VALID_APPEARANCES = ["filled", "outline", "primary"];
const VALID_COLOR_MODES = ["default", "semantic", "custom"];
const VALID_SEMANTIC_TYPES = [
  "positive",
  "negative",
  "warning",
  "info"
];
const VALID_CUSTOM_COLORS = [
  "purple",
  "pink",
  "glacier",
  "amber",
  "greenish",
  "bluish"
];
const DEFAULT_ICON = "user";
const O9LOGO_ICON = "o9-logo";
const NOVAI_ICON = "genai";
const DEFAULT_LOGO_BASE_URL = "/logos";
function autoTooltip(opts) {
  switch (opts.variant) {
    case "o9logo":
      return "o9 Platform";
    case "novai":
      return "Nova AI assistant";
    case "image":
      return opts.alt || opts.name || "User avatar";
    case "initials":
      return opts.name || "User";
    case "logo":
      return opts.name || opts.logo || "Logo";
    case "icon":
    default:
      return opts.name || "User";
  }
}
const ArvoAvatar = forwardRef(function ArvoAvatar2(props, ref) {
  const {
    variant: variantProp = "icon",
    size: sizeProp = "md",
    appearance: appearanceProp,
    colorMode: colorModeProp = "default",
    semanticType: semanticTypeProp = "positive",
    customColor: customColorProp = "purple",
    name,
    email,
    src,
    alt,
    icon,
    logo,
    logoBaseUrl = DEFAULT_LOGO_BASE_URL,
    tooltip,
    isInteractive: isInteractiveProp = false,
    isDisabled = false,
    isLoading = false,
    href,
    target,
    rel,
    onClick,
    className,
    style,
    id
  } = props;
  const variant = VALID_VARIANTS.includes(variantProp) ? variantProp : "icon";
  const size = VALID_SIZES.includes(sizeProp) ? sizeProp : "md";
  const appearanceDefault = variant === "novai" ? "outline" : "filled";
  let appearance = appearanceProp && VALID_APPEARANCES.includes(appearanceProp) ? appearanceProp : appearanceDefault;
  const colorMode = VALID_COLOR_MODES.includes(colorModeProp) ? colorModeProp : "default";
  const semanticType = VALID_SEMANTIC_TYPES.includes(
    semanticTypeProp
  ) ? semanticTypeProp : "positive";
  const customColor = VALID_CUSTOM_COLORS.includes(customColorProp) ? customColorProp : "purple";
  if (variant === "logo" && appearance === "filled") appearance = "outline";
  if (variant === "novai" && appearance === "primary") appearance = "outline";
  const effectiveAppearance = colorMode === "semantic" ? "filled" : appearance;
  const themingApplies = variant === "icon" || variant === "initials" || variant === "logo";
  const isSvgLogo = variant === "logo" && Boolean(logo);
  const isInteractive = isInteractiveProp || Boolean(href) || Boolean(onClick);
  const renderAs = href ? "a" : isInteractive ? "button" : "span";
  const blocked = isDisabled || isLoading;
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [src]);
  const resolvedInitials = useMemo(
    () => resolveInitials({ name, email, maxChars: size === "xs" ? 1 : 2 }),
    [name, email, size]
  );
  let effectiveVariant = variant;
  if (variant === "image" && (!src || imageFailed)) {
    effectiveVariant = resolvedInitials ? "initials" : "icon";
  }
  const resolvedIcon = effectiveVariant === "o9logo" ? O9LOGO_ICON : effectiveVariant === "novai" ? NOVAI_ICON : effectiveVariant === "icon" ? icon || DEFAULT_ICON : effectiveVariant === "logo" ? icon || DEFAULT_ICON : DEFAULT_ICON;
  const resolvedTooltip = tooltip ?? autoTooltip({
    variant: effectiveVariant,
    name,
    alt,
    logo
  });
  const emitAppearanceClass = themingApplies || variant === "novai" || variant === "image" && effectiveVariant !== "image";
  const classes = [
    "arvo-avt",
    `arvo-avt--${effectiveVariant}`,
    `arvo-avt--${size}`,
    emitAppearanceClass ? `arvo-avt--${effectiveAppearance}` : "",
    // Color-mode + specific color modifiers (only for icon / initials).
    (effectiveVariant === "icon" || effectiveVariant === "initials") && colorMode !== "default" ? `arvo-avt--${colorMode}` : "",
    (effectiveVariant === "icon" || effectiveVariant === "initials") && colorMode === "semantic" ? `arvo-avt--${semanticType}` : "",
    (effectiveVariant === "icon" || effectiveVariant === "initials") && colorMode === "custom" ? `arvo-avt--${customColor}` : "",
    isSvgLogo ? "arvo-avt--svg" : "",
    isInteractive ? "interactive" : "",
    isLoading ? "loading" : "",
    className ?? ""
  ].filter(Boolean).join(" ");
  const logoStyle = isSvgLogo ? {
    ["--arvo-avt-logo-url-light"]: `url('${logoBaseUrl}/light/${logo}.svg')`,
    ["--arvo-avt-logo-url-dark"]: `url('${logoBaseUrl}/dark/${logo}.svg')`
  } : void 0;
  const mergedStyle = logoStyle || style ? { ...logoStyle ?? {}, ...style ?? {} } : void 0;
  const handleClick = (event) => {
    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick == null ? void 0 : onClick(event);
  };
  const innerContent = (() => {
    if (effectiveVariant === "image") {
      return /* @__PURE__ */ jsx(
        "img",
        {
          className: "arvo-avt__img",
          src,
          alt: "",
          onError: () => setImageFailed(true)
        }
      );
    }
    if (effectiveVariant === "initials") {
      const text = size === "xs" ? resolvedInitials.slice(0, 1) : resolvedInitials;
      return /* @__PURE__ */ jsx("span", { className: "arvo-avt__text", "aria-hidden": "true", children: text || "" });
    }
    if (isSvgLogo) {
      return /* @__PURE__ */ jsx("span", { className: "arvo-avt__logo", "aria-hidden": "true" });
    }
    return /* @__PURE__ */ jsx(
      "i",
      {
        className: `arvo-avt__ico o9con o9con-${resolvedIcon}`,
        "aria-hidden": "true"
      }
    );
  })();
  const ariaProps = {
    "aria-label": resolvedTooltip,
    title: resolvedTooltip
  };
  if (isLoading) ariaProps["aria-busy"] = true;
  if (isDisabled) ariaProps["aria-disabled"] = true;
  if (renderAs === "a") {
    const safeTarget = isDisabled ? void 0 : target;
    const safeRel = isDisabled ? void 0 : safeTarget === "_blank" && !rel ? "noopener noreferrer" : rel;
    return /* @__PURE__ */ jsx(
      "a",
      {
        ref,
        id,
        href: isDisabled ? void 0 : href,
        target: safeTarget,
        rel: safeRel,
        className: classes,
        style: mergedStyle,
        onClick: handleClick,
        tabIndex: isDisabled ? -1 : void 0,
        ...ariaProps,
        children: innerContent
      }
    );
  }
  if (renderAs === "button") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        id,
        type: "button",
        className: classes,
        style: mergedStyle,
        onClick: handleClick,
        disabled: isDisabled || void 0,
        tabIndex: isDisabled ? -1 : void 0,
        ...ariaProps,
        children: innerContent
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      ref,
      id,
      className: classes,
      style: mergedStyle,
      role: "img",
      ...ariaProps,
      children: innerContent
    }
  );
});
export {
  ArvoAvatar,
  ArvoAvatar as default
};
//# sourceMappingURL=index40.js.map
