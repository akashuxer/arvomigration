"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const core = require("@arvo/core");
function useContextMenuController(options) {
  const {
    targetRef,
    contextSelector,
    resolveContext,
    onRequest,
    longPressMs,
    keyboard,
    disabled = false
  } = options;
  const controllerRef = React.useRef(null);
  const onRequestRef = React.useRef(onRequest);
  onRequestRef.current = onRequest;
  const resolveContextRef = React.useRef(resolveContext);
  resolveContextRef.current = resolveContext;
  React.useEffect(() => {
    if (disabled) return;
    const target = targetRef.current;
    if (!target) return;
    const ctl = core.createContextMenuController({
      target,
      contextSelector,
      resolveContext: resolveContextRef.current ? (el) => resolveContextRef.current(el) : void 0,
      onRequest: (req, helpers) => onRequestRef.current(req, helpers),
      longPressMs,
      keyboard
    });
    controllerRef.current = ctl;
    return () => {
      ctl.destroy();
      controllerRef.current = null;
    };
  }, [targetRef, contextSelector, longPressMs, keyboard, disabled]);
  return {
    request: (init) => {
      var _a;
      return (_a = controllerRef.current) == null ? void 0 : _a.request(init);
    }
  };
}
exports.useContextMenuController = useContextMenuController;
//# sourceMappingURL=index96.cjs.map
