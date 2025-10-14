# TarotWheel Component - Technical Documentation

## 📋 Overview

The `TarotWheel` component is an interactive tarot card selector that displays cards along a curved arc path. Users can scroll/drag through cards with physics-based inertia, and select the centered card with a flip animation.

## 🏗️ Architecture

```
TarotWheel (Container)
├── Full Card Overlay (when selected)
├── Center Indicator (Arrow)
└── Scrollable Container
    └── Wheel
        └── TarotCard[] (positioned along arc)
```

### Component Files

| File                       | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `TarotWheel.tsx`           | Main container, manages scroll state, inertia, card selection |
| `TarotCard.tsx`            | Individual card component, handles positioning and rotation   |
| `arrangeByAngleContour.ts` | Calculates position and rotation along arc path               |
| `TarotWheel.scss`          | Styling and animations                                        |
| `tarotCards.data.ts`       | Card data (78 tarot cards)                                    |

---

## 🔄 1. Scrolling System

### Scroll State Management

The component uses **three scroll values** working together:

```
User Drag → targetScrollRef → displayScrollRef → scrollOffset (state)
                  ↓                    ↓               ↓
              (instant)          (smoothed)      (rendered)
```

**Key Variables:**

```typescript
const [scrollOffset, setScrollOffset] = useState(0); // Rendered scroll position
const targetScrollRef = useRef(0); // Target scroll (instant updates)
const displayScrollRef = useRef(0); // Display scroll (smoothed)
const accScrollOffset = useRef(0); // Accumulated scroll during drag
```

### Drag Handling Flow

```
┌─────────────────┐
│ PointerDown     │ → Stop animations, capture pointer
└────────┬────────┘
         │
┌────────▼────────┐
│ PointerMove     │ → Calculate deltaY, update targetScrollRef
│                 │ → Collect velocity samples
└────────┬────────┘
         │
┌────────▼────────┐
│ PointerUp       │ → Calculate velocity from samples
│                 │ → Start inertia OR snap to center
└─────────────────┘
```

**Code Flow:**

```typescript
handlePointerMove() {
  const deltaY = prevY.current - e.clientY;

  // Update scroll position
  accScrollOffset.current = clampScroll(accScrollOffset.current + deltaY);
  targetScrollRef.current = accScrollOffset.current;

  // Track velocity samples (last 6 points)
  velocitySamples.current.push({
    time: performance.now(),
    scroll: accScrollOffset.current
  });
}
```

### Inertia Physics

When user releases drag with velocity, inertia takes over:

```typescript
animateInertia(t: number) {
  const dt = (t - lastInertiaTime.current) / 1000;

  // Apply velocity with friction
  targetScrollRef.current += velocity.current * dt;
  velocity.current *= inertiaFriction;  // Default: 0.95

  // Magnetic snap to nearest card
  const nearestCardScroll = Math.round(targetScrollRef.current / spacing) * spacing;
  const snapForce = 0.2 * (1 - velocityFactor);
  targetScrollRef.current += (nearestCardScroll - targetScrollRef.current) * snapForce;

  // Stop when velocity drops below threshold
  if (Math.abs(velocity.current) < inertiaStopV) {
    snapToCenter();
  }
}
```

### Smooth Animation

Display scroll smoothly follows target scroll:

```typescript
animate() {
  const alpha = 0.25;  // Smoothing factor
  const diff = targetScrollRef.current - displayScrollRef.current;
  displayScrollRef.current += diff * alpha;
  setScrollOffset(displayScrollRef.current);
}
```

**Visual representation:**

```
Target Scroll: ━━━━━━━━━━━●  (instant jump)
Display Scroll: ～～～～～～～●  (smooth curve)
```

---

## 📐 2. Arc Path Geometry

### The Arc Contour

Cards follow a **circular arc** that transitions into **parallel vertical rays**:

```
        Center (0°)
            ↓
        ╭───●───╮
       ╱    │    ╲
      │     │     │
     ╱      │      ╲
    │    ARC (0° → rayAngle)    │
    │       │       │
    ║       │       ║  ← Vertical rays
    ║       │       ║    (parallel lines)
```

### Mathematical Model

The `arrangeByAngleContour` function calculates position based on distance traveled along the contour:

```typescript
function arrangeByAngleContour(s: number, { R, rayAngleDeg }) {
  const thetaMaxRad = (rayAngleDeg * Math.PI) / 180;
  const L_arc = R * thetaMaxRad; // Arc length

  if (s <= L_arc) {
    // ON THE ARC: Use polar coordinates
    const theta = s / R;
    return {
      x: R * Math.sin(theta),
      y: R - R * Math.cos(theta),
      rotationDeg: (theta * 180) / Math.PI,
    };
  } else {
    // ON THE RAY: Vertical continuation
    const sRay = s - L_arc;
    const arcEndX = R * Math.sin(thetaMaxRad);
    const arcEndY = R - R * Math.cos(thetaMaxRad);

    return {
      x: arcEndX, // X constant (parallel)
      y: arcEndY + sRay, // Y increases linearly
      rotationDeg: 90, // Fixed vertical rotation
    };
  }
}
```

### Coordinate System

```
       Origin (0, 0)
           ↓
     ━━━━━━●━━━━━━
           │
        R  │  (Arc radius)
           │
     ╭─────●─────╮  ← Start of arc (y = R - R·cos(0) = 0)
    ╱      ↓      ╲
   │   Card at θ   │

   Position: (R·sin(θ), R - R·cos(θ))
   Rotation: θ (degrees)
```

### Card Positioning Example

Given:

- `spacing = 100` (distance between cards)
- `rayAngle = 90°`
- `arcRadius = 300px`

```
Card Index 0: offset = 0     → (0, 0)     rotation = 0°
Card Index 1: offset = 100   → (52, 8)    rotation = 19°
Card Index 2: offset = 200   → (95, 30)   rotation = 38°
...
Card Index 5: offset = 500   → (0, 500)   rotation = 90° (on ray)
```

---

## 🎯 3. Card Tilt Angle

### Rotation Logic

Each card's rotation follows the **tangent** of the arc at its position:

```
          ↑ 0° (vertical)
          │
          │
      ╭───┼───╮
     ╱    │    ╲
    │  ╱  │  ╲  │
   ╱ ╱    │    ╲ ╲
  │ │     │     │ │
 45°│     0°    │ -45°
    │           │
```

**In `TarotCard.tsx`:**

```typescript
const { translateX, translateY, rotationDeg } = useMemo(() => {
  const absOffset = Math.abs(offsetFromCenter);
  const side = offsetFromCenter < 0 ? -1 : 1; // Left or right

  const result = arrangeByAngleContour(absOffset, {
    R: arcRadius,
    rayAngleDeg: rayAngle,
  });

  return {
    translateX: side * result.x, // Mirror for left side
    translateY: result.y,
    rotationDeg: side * result.rotationDeg, // Mirror rotation
  };
}, [offsetFromCenter, rayAngle, arcRadius]);

// Force centered card to be vertical (0°)
const finalRotation = isCentered ? 0 : rotationDeg;
```

### Rotation Override for Centered Card

```
Left Cards         Center           Right Cards
  ╱                 │                 ╲
 ╱     rotation     │    rotation      ╲
│      = -45°       │    = 0° ★         │
╲                   │                   ╱
 ╲                  │                  ╱
  rotation = -90°   │      rotation = 45°
```

The **centered card** always gets `rotation = 0°` regardless of its calculated angle, making it perfectly vertical and ready for selection.

---

## 🎯 4. Active Card Calculation

### Center Detection

The active (centered) card is determined by scroll position:

```typescript
const getCenteredCardIndex = (value = scrollOffset) => {
  const clamped = clampScroll(value);
  const index = Math.round(clamped / spacing);
  return Math.max(0, Math.min(cards.length - 1, index));
};
```

**Visual Example:**

```
spacing = 100px

Scroll:    0     100    200    300    400
           │      │      │      │      │
Cards:     0      1      2      3      4
           ●──────●──────●──────●──────●

scrollOffset = 150  →  150 / 100 = 1.5  →  round(1.5) = 2  →  Card #2
scrollOffset = 99   →  99 / 100 = 0.99  →  round(0.99) = 1  →  Card #1
```

### Magnetic Snapping

Cards "snap" to center when close:

```typescript
// In animation loop
const nearestCardIndex = Math.round(targetScrollRef.current / spacing);
const nearestCardScroll = nearestCardIndex * spacing;
const distanceFromCenter = Math.abs(
  targetScrollRef.current - nearestCardScroll
);

const snapThreshold = 30; // px
if (distanceFromCenter < snapThreshold && !isDragging.current) {
  const snapForce = 0.15;
  targetScrollRef.current +=
    (nearestCardScroll - targetScrollRef.current) * snapForce;
}
```

**Snap Behavior:**

```
        Target Range (±30px)
      ┌─────────────────────┐
      │         ↓           │
─────────────●─────────────────────
    Card 1   Center   Card 2

If within range → Magnetic pull to center
If outside → Free scrolling
```

---

## 🃏 5. Card Selection & Flip Animation

### Selection Flow

```
┌──────────────────────┐
│ User clicks card     │
└──────────┬───────────┘
           │
     ┌─────▼─────┐
     │ Is it     │ NO → Ignore click
     │ centered? │
     └─────┬─────┘
          YES
           │
     ┌─────▼──────────────┐
     │ Show full card     │
     │ Start flip anim    │
     └─────┬──────────────┘
           │
     ┌─────▼──────────────┐
     │ After 1.5s         │
     │ Call onCardSelect  │
     └────────────────────┘
```

**Code:**

```typescript
const handleCardClick = (card: TarotWheelCard, index: number) => {
  // Guard conditions
  if (selectedCard || isFlipping) return;
  if (index !== getCenteredCardIndex()) return; // Only centered card

  stopAnimation();

  // Show full card overlay with flip
  setSelectedCard(card);
  setShowFullCard(true);
  setIsFlipping(true);

  // Complete selection after animation
  setTimeout(() => {
    setIsFlipping(false);
    onCardSelect?.(card);
  }, flipDurationMs);
};
```

### Flip Animation

The flip uses CSS 3D transforms:

```scss
@keyframes flipCard {
  0% {
    transform: rotateY(0deg);
  } // Back visible
  50% {
    transform: rotateY(180deg);
  } // Midway
  100% {
    transform: rotateY(180deg);
  } // Front visible
}
```

**Card Structure (3D Flip):**

```
.spinning-wheel__card-inner
  transform-style: preserve-3d
  ├── .spinning-wheel__card-back
  │     backface-visibility: hidden
  │     (Visible at 0°)
  └── .spinning-wheel__card-front
        transform: rotateY(180deg)
        backface-visibility: hidden
        (Visible at 180°)
```

**Visual:**

```
     Front (0°)          Mid (90°)         Back (180°)
    ┌─────────┐         ┌─┐               ┌─────────┐
    │ Back    │         │ │               │  Front  │
    │ Side    │   →     │ │         →     │  Image  │
    │ Pattern │         │ │               │         │
    └─────────┘         └─┘               └─────────┘
```

---

## 🎨 6. CSS Variables & Responsive Design

### Key CSS Variables

```scss
:root {
  --twl-arc-radius: 400px; // Arc radius (synced with JS)
  --twl-pointer-top: calc(var(--twl-arc-radius) - 1.5rem);

  --twl-card-w: 110px; // Card dimensions
  --twl-card-h: 194px;
}

@media (max-width: 768px) {
  :root {
    --twl-arc-radius: 350px;
    --twl-card-w: 90px;
    --twl-card-h: 158px;
  }
}

@media (max-width: 480px) {
  :root {
    --twl-arc-radius: 300px;
    --twl-card-w: 70px;
    --twl-card-h: 123px;
  }
}
```

### Arc Radius Synchronization

The arc radius must be synchronized between CSS and JS:

```typescript
useEffect(() => {
  const updateArcRadius = () => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--twl-arc-radius")
      .trim();
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setArcRadius(numValue);
    }
  };

  updateArcRadius();
  window.addEventListener("resize", updateArcRadius);
  return () => window.removeEventListener("resize", updateArcRadius);
}, []);
```

---

## 🔧 7. Configuration Props

### TarotWheel Props

| Prop              | Type               | Default  | Description                                         |
| ----------------- | ------------------ | -------- | --------------------------------------------------- |
| `cards`           | `TarotWheelCard[]` | Required | Array of cards to display                           |
| `onCardSelect`    | `(card) => void`   | Optional | Callback when card is selected                      |
| `spacing`         | `number`           | `100`    | Distance between cards (px) - controls scroll speed |
| `rayAngle`        | `number`           | `90`     | Maximum arc angle (degrees) before vertical rays    |
| `flipDurationMs`  | `number`           | `1500`   | Flip animation duration (ms)                        |
| `inertiaFriction` | `number`           | `0.95`   | Friction coefficient (0-1), higher = longer spin    |
| `inertiaStopV`    | `number`           | `5`      | Velocity threshold for stopping (px/s)              |

### Usage Example

```tsx
<TarotWheel
  cards={allTarotCards}
  onCardSelect={handleCardSelect}
  spacing={100} // Tight spacing = slower scroll
  rayAngle={90} // 90° arc before vertical rays
  flipDurationMs={1500} // 1.5s flip animation
  inertiaFriction={0.95} // Smooth deceleration
  inertiaStopV={5} // Stop at 5px/s
/>
```

---

## 🌊 8. Animation States & Lifecycle

### State Machine

```
┌─────────────┐
│   Idle      │ ←──────────────┐
└─────┬───────┘                │
      │ User drags             │
      ▼                        │
┌─────────────┐                │
│  Dragging   │                │
└─────┬───────┘                │
      │ Release                │
      ▼                        │
┌─────────────┐                │
│   Inertia   │ ───────────────┤
└─────┬───────┘  Velocity < 5  │
      │                        │
      ▼                        │
┌─────────────┐                │
│  Snapping   │ ────────────────┘
└─────────────┘
```

### Animation Flags

```typescript
const isDragging = useRef(false);        // User is dragging
const isInertia = useRef(false);         // Inertia animation active
const [isFlipping, setIsFlipping] = ...  // Card flip animation
const [selectedCard, setSelectedCard] = ...  // Card selected
```

### Animation Cleanup

```typescript
useEffect(() => {
  return () => stopAnimation(); // Cleanup on unmount
}, []);

const stopAnimation = () => {
  if (animationFrameId.current != null) {
    cancelAnimationFrame(animationFrameId.current);
  }
  animationFrameId.current = null;
  isInertia.current = false;
  velocity.current = 0;
};
```

---

## 📊 9. Performance Optimizations

### 1. **Transform-based Positioning**

Cards use CSS transforms (GPU-accelerated):

```typescript
style={{
  transform: `translate(${translateX}px, ${translateY}px) rotate(${finalRotation}deg)`
}}
```

### 2. **useMemo for Geometry Calculations**

```typescript
const { translateX, translateY, rotationDeg } = useMemo(() => {
  // Heavy calculations only when offsetFromCenter changes
  return arrangeByAngleContour(...);
}, [offsetFromCenter, rayAngle, arcRadius]);
```

### 3. **requestAnimationFrame**

Smooth 60fps animations:

```typescript
animationFrameId.current = requestAnimationFrame(animate);
```

### 4. **Velocity Sampling**

Tracks last 6 samples to calculate accurate velocity:

```typescript
velocitySamples.current.push({ time: now, scroll: accScrollOffset.current });
if (velocitySamples.current.length > 6) velocitySamples.current.shift();
```

### 5. **will-change CSS Hints**

```scss
.spinning-wheel__card {
  will-change: transform;

  &--centered {
    will-change: filter, transform;
  }
}
```

---

## 🎭 10. Visual Effects

### Centered Card Highlight

```scss
.spinning-wheel__card--centered {
  z-index: 10;
  filter: brightness(1.3) drop-shadow(0 0 30px var(--twl-glow));

  &:hover {
    filter: brightness(1.4) drop-shadow(0 0 40px var(--twl-glow-strong));
  }
}
```

### Indicator Arrow

```scss
.spinning-wheel__indicator-arrow {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 30px solid #8a2be2;
  filter: drop-shadow(0 0 10px rgba(138, 43, 226, 0.8));
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

---

## 🐛 11. Edge Cases & Guards

### 1. **Boundary Clamping**

```typescript
const clampScroll = (v: number) => Math.max(0, Math.min(maxScroll, v));
const maxScroll = Math.max(0, (cards.length - 1) * spacing);
```

### 2. **Click Prevention During Animation**

```typescript
if (selectedCard || isFlipping) return; // Ignore clicks
if (index !== getCenteredCardIndex()) return; // Only centered card
```

### 3. **Pointer Capture**

```typescript
e.currentTarget.setPointerCapture(e.pointerId); // Track pointer even outside element
```

### 4. **Card Click vs Container Drag**

```typescript
if ((e.target as HTMLElement).closest(".spinning-wheel__card")) return;
// Don't start drag if clicking directly on card
```

---

## 📈 12. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        TarotWheel                           │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ User Input   │───→│ Scroll State │───→│   Render     │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│    Drag/Inertia         scrollOffset         For each card │
│                              │                    │         │
│                    ┌─────────▼─────────┐         │         │
│                    │ getCenteredCard() │         │         │
│                    └───────────────────┘         │         │
│                                                   │         │
│  ┌────────────────────────────────────────────────▼──────┐ │
│  │                    TarotCard                          │ │
│  │                                                        │ │
│  │  offsetFromCenter ───→ arrangeByAngleContour()       │ │
│  │                              │                        │ │
│  │                              ▼                        │ │
│  │                     { x, y, rotation }                │ │
│  │                              │                        │ │
│  │                              ▼                        │ │
│  │              transform: translate() rotate()          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 13. Quick Reference

### Key Formulas

| Concept            | Formula                                           |
| ------------------ | ------------------------------------------------- |
| **Arc Length**     | `L = R × θ` (where θ in radians)                  |
| **Arc Position**   | `x = R × sin(θ)`, `y = R - R × cos(θ)`            |
| **Centered Index** | `round(scrollOffset / spacing)`                   |
| **Velocity**       | `Δscroll / Δtime` from last 6 samples             |
| **Inertia Update** | `scroll += velocity × dt`, `velocity *= friction` |
| **Smooth Follow**  | `display += (target - display) × 0.25`            |

### State Variables Quick Lookup

```typescript
// Scroll positions
scrollOffset; // React state (triggers render)
targetScrollRef; // Instant target position
displayScrollRef; // Smoothed display position
accScrollOffset; // Accumulated during drag

// Animation control
isDragging; // Pointer is down and moving
isInertia; // Inertia animation running
velocity; // Current velocity (px/s)
velocitySamples; // Last 6 position samples

// Card state
selectedCard; // Currently selected card
isFlipping; // Flip animation active
showFullCard; // Full card overlay visible
```

---

## 🎯 14. Troubleshooting

### Cards not aligning properly

- Check `--twl-arc-radius` CSS variable matches JS `arcRadius`
- Verify `spacing` prop matches intended card density

### Jerky scrolling

- Increase `inertiaFriction` (e.g., 0.98 instead of 0.95)
- Adjust `alpha` smoothing factor in `animate()`

### Cards won't snap to center

- Check `snapThreshold` (default 30px)
- Verify `spacing` is reasonable (50-150px recommended)

### Selection not working

- Ensure card is centered (`index === getCenteredCardIndex()`)
- Check `selectedCard` and `isFlipping` states aren't blocking

---

## 📝 15. Future Enhancements

### Potential Improvements

1. **Touch gesture improvements**

   - Multi-finger gestures
   - Momentum-based flick

2. **Accessibility**

   - Keyboard navigation (arrow keys)
   - Screen reader announcements

3. **Visual effects**

   - Particle effects on selection
   - Card reveal animations

4. **Performance**
   - Virtual scrolling for large card sets
   - Card pooling/recycling

---

## 📚 Related Files

- `TarotStage.tsx` - Container wrapper component
- `tarot.page.tsx` - Page implementation example
- `TarotWheel.scss` - Full styling and animations
- `tarotCards.data.ts` - 78 tarot cards data

---

**Last Updated:** October 2025  
**Component Version:** 1.0  
**Author:** numero_tma team
