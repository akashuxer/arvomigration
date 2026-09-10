import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { computePosition, createPositionWatcher } from "@arvo/core";
function usePositioning(options) {
  const {
    anchorRef,
    anchorRect = null,
    floatRef,
    placement = "bottom-start",
    gap = 2,
    enabled = true,
    width,
    observeContainerSelector,
    flip = "main-axis",
    lockPlacementOnFloatResize = false
  } = options;
  const [position, setPosition] = useState(null);
  const watcherRef = useRef(null);
  const lockedPlacementRef = useRef(null);
  const lockPlacementRef = useRef(lockPlacementOnFloatResize);
  lockPlacementRef.current = lockPlacementOnFloatResize;
  const anchorPagePointRef = useRef(null);
  if (anchorRect) {
    anchorPagePointRef.current = {
      x: anchorRect.x + (typeof window === "undefined" ? 0 : window.scrollX),
      y: anchorRect.y + (typeof window === "undefined" ? 0 : window.scrollY)
    };
  } else {
    anchorPagePointRef.current = null;
  }
  const liveViewportPoint = useCallback(() => {
    const p = anchorPagePointRef.current;
    if (!p) return null;
    return { x: p.x - window.scrollX, y: p.y - window.scrollY };
  }, []);
  const optionsRef = useRef({
    placement,
    gap,
    width,
    observeContainerSelector,
    flip
  });
  optionsRef.current = { placement, gap, width, observeContainerSelector, flip };
  const update = useCallback(() => {
    if (watcherRef.current) {
      watcherRef.current.update();
      return;
    }
    if (!floatRef.current) return;
    if (anchorRef.current) {
      setPosition(
        computePosition(anchorRef.current, floatRef.current, optionsRef.current)
      );
    } else {
      const live = liveViewportPoint();
      if (live) {
        setPosition(
          computePosition(live, floatRef.current, optionsRef.current)
        );
      }
    }
  }, [anchorRef, floatRef, liveViewportPoint]);
  useLayoutEffect(() => {
    var _a;
    if (!enabled) {
      (_a = watcherRef.current) == null ? void 0 : _a.destroy();
      watcherRef.current = null;
      lockedPlacementRef.current = null;
      setPosition(null);
      return;
    }
    const anchor = anchorRef.current;
    const float = floatRef.current;
    if (!float) return;
    const watcherOpts = {
      placement,
      gap,
      width,
      observeContainerSelector,
      flip
    };
    function applyWatcherUpdate(result, source) {
      if (lockPlacementRef.current && source === "float-size" && lockedPlacementRef.current != null) {
        const live = anchor ?? liveViewportPoint();
        if (!live || !float) return;
        const locked = computePosition(live, float, {
          ...watcherOpts,
          placement: lockedPlacementRef.current
        });
        setPosition(locked);
        return;
      }
      lockedPlacementRef.current = result.placement;
      setPosition(result);
    }
    if (anchor) {
      const initial = computePosition(anchor, float, watcherOpts);
      lockedPlacementRef.current = initial.placement;
      setPosition(initial);
      const watcher = createPositionWatcher(
        anchor,
        float,
        watcherOpts,
        applyWatcherUpdate
      );
      watcherRef.current = watcher;
      return () => {
        watcher.destroy();
        watcherRef.current = null;
        lockedPlacementRef.current = null;
      };
    }
    if (anchorPagePointRef.current) {
      const live = liveViewportPoint();
      if (live) {
        const initial = computePosition(live, float, watcherOpts);
        lockedPlacementRef.current = initial.placement;
        setPosition(initial);
      }
      const watcher = createPositionWatcher(
        () => liveViewportPoint() ?? { x: 0, y: 0 },
        float,
        watcherOpts,
        applyWatcherUpdate
      );
      watcherRef.current = watcher;
      return () => {
        watcher.destroy();
        watcherRef.current = null;
        lockedPlacementRef.current = null;
      };
    }
  }, [
    anchorRef,
    floatRef,
    enabled,
    placement,
    gap,
    width,
    observeContainerSelector,
    flip,
    liveViewportPoint,
    anchorRect == null ? void 0 : anchorRect.x,
    anchorRect == null ? void 0 : anchorRect.y
  ]);
  return { position, update };
}
export {
  usePositioning
};
//# sourceMappingURL=index9.js.map
