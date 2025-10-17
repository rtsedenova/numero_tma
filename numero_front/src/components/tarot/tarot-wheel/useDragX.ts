  import * as React from 'react';

  type DragXOpts = {
    onStart?: () => void;
    onDelta: (dx: number) => void;
    onEnd?: (totalDx: number, velocityX: number) => void;
    onClick?: (e: React.PointerEvent<HTMLDivElement>) => void;
    lockY?: boolean; 
  };

  export function useDragX({ onStart, onDelta, onEnd, onClick, lockY = true }: DragXOpts) {
    const dragging = React.useRef(false);
    const lastX = React.useRef(0);
    const total = React.useRef(0);
    const startX = React.useRef(0);
    const startY = React.useRef(0);
    const startTime = React.useRef(0);

    const trail = React.useRef<Array<{ t: number; x: number }>>([]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      dragging.current = true;
      lastX.current = e.clientX;
      startX.current = e.clientX;
      startY.current = e.clientY;
      startTime.current = performance.now();
      total.current = 0;
      trail.current = [{ t: performance.now(), x: e.clientX }];
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onStart?.();
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      total.current += dx;

      const now = performance.now();
      trail.current.push({ t: now, x: e.clientX });
      if (trail.current.length > 8) trail.current.shift();

      onDelta(dx);
    };

    const finish = (e?: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      dragging.current = false;

      const pts = trail.current;
      let velocityX = 0;
      if (pts.length >= 2) {
        const a = pts[0];
        const b = pts[pts.length - 1];
        const dt = (b.t - a.t) / 1000; 
        if (dt > 0) velocityX = (b.x - a.x) / dt; 
      }

      // Check if this was a click (minimal movement and quick)
      if (e && onClick) {
        const dx = Math.abs(e.clientX - startX.current);
        const dy = Math.abs(e.clientY - startY.current);
        const dt = performance.now() - startTime.current;
        const CLICK_THRESHOLD = 5; // pixels
        const TIME_THRESHOLD = 300; // ms
        
        if (dx < CLICK_THRESHOLD && dy < CLICK_THRESHOLD && dt < TIME_THRESHOLD) {
          onClick(e);
          return; // Don't call onEnd for clicks
        }
      }

      onEnd?.(total.current, velocityX);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => finish(e),
      onPointerCancel: () => finish(),
      style: { touchAction: lockY ? 'none' as const : 'pan-y' as const, cursor: 'grab' as const },
    };
  }
