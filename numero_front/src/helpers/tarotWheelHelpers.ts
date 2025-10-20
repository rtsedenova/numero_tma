export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function springTo(opts: {
from: number;
to: number;
onUpdate: (x: number) => void;
onFinish?: () => void;
k?: number;
c?: number;
precision?: number;
}) {
const { from, to, onUpdate, onFinish, k = 700, c = 32, precision = 0.001 } = opts;

let x = from;
let v = 0; 
let raf = 0;
let lastTs = performance.now();

const step = (ts: number) => {
    const dt = Math.min(0.032, (ts - lastTs) / 1000); 
    lastTs = ts;

    const Fspring = -k * (x - to);
    const Fdamp = -c * v;
    const a = Fspring + Fdamp;

    v += a * dt;
    x += v * dt;

    onUpdate(x);

    if (Math.abs(v) < precision && Math.abs(x - to) < precision) {
    onUpdate(to);
    onFinish?.();
    cancelAnimationFrame(raf);
    return;
    }
    raf = requestAnimationFrame(step);
};

raf = requestAnimationFrame(step);
return () => cancelAnimationFrame(raf);
}
