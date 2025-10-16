  import * as React from 'react';

  type DragXOpts = {
    onStart?: () => void;
    onDelta: (dx: number) => void;
    onEnd?: (totalDx: number, velocityX: number) => void;
    lockY?: boolean; 
  };

  export function useDragX({ onStart, onDelta, onEnd, lockY = true }: DragXOpts) {
    const dragging = React.useRef(false);
    const lastX = React.useRef(0);
    const total = React.useRef(0);

    const trail = React.useRef<Array<{ t: number; x: number }>>([]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      dragging.current = true;
      lastX.current = e.clientX;
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

    const finish = () => {
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
      onEnd?.(total.current, velocityX);
    };

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      style: { touchAction: lockY ? 'none' as const : 'pan-y' as const, cursor: 'grab' as const },
    };
  }
