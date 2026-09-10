import { useRef, useEffect } from "react";
import { createContextMenuController } from "@arvo/core";
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
  const controllerRef = useRef(null);
  const onRequestRef = useRef(onRequest);
  onRequestRef.current = onRequest;
  const resolveContextRef = useRef(resolveContext);
  resolveContextRef.current = resolveContext;
  useEffect(() => {
    if (disabled) return;
    const target = targetRef.current;
    if (!target) return;
    const ctl = createContextMenuController({
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
export {
  useContextMenuController
};
//# sourceMappingURL=index96.js.map
