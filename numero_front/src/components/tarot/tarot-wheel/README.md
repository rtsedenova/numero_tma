# Tarot Wheel Component System

A sophisticated, interactive tarot card wheel component with physics-based scrolling, inertia, and 3D flip animations. The system arranges cards along an arc contour and provides a smooth, engaging user experience for card selection.

## 📋 Table of Contents

- [Overview](#overview)
- [Component Architecture](#component-architecture)
- [Components](#components)
  - [TarotStage](#tarotstage)
  - [TarotWheel](#tarotwheel)
  - [TarotCard](#tarotcard)
- [Geometry System](#geometry-system)
- [Configuration Guide](#configuration-guide)
- [Usage Examples](#usage-examples)
- [Styling](#styling)
- [Accessibility](#accessibility)

---

## Overview

The Tarot Wheel system consists of three main components working together:

1. **TarotStage** - Provides a styled container/stage with gradient background and pulsing effects
2. **TarotWheel** - Core component handling scrolling, inertia, card selection, and interaction logic
3. **TarotCard** - Individual card component with 3D positioning and flip animations

The cards are arranged along a geometric arc contour, creating a visually appealing wheel effect. Users can:

- Drag/scroll through cards with smooth physics-based inertia
- Tap the centered card to select it
- View the selected card in a full-screen overlay
- Reset and choose another card

---

## Component Architecture

```
TarotStage (container/visual wrapper)
  └── TarotWheel (main logic & state)
        ├── Indicator (center arrow)
        ├── Container (drag/scroll area)
        │     └── Wheel
        │           └── TarotCard[] (positioned cards)
        └── Full Card Overlay (selected card view)
```

### Data Flow

1. **TarotWheel** manages:

   - Scroll offset (position in the wheel)
   - Selected card state
   - Flipping animation state
   - Drag and inertia physics

2. **TarotCard** receives:

   - Position offset from center
   - Centered state (is this card under the indicator?)
   - Flip animation state
   - Interaction callbacks

3. **arrangeByAngleContour** utility:
   - Calculates (x, y, rotation) for each card based on offset
   - Creates the arc contour geometry

---

## Components

### TarotStage

The outer container component that provides visual styling and background effects.

#### Props

| Prop           | Type        | Default     | Description                                    |
| -------------- | ----------- | ----------- | ---------------------------------------------- |
| `className`    | `string`    | `""`        | Additional CSS classes                         |
| `maxWidth`     | `string`    | `undefined` | Maximum width (CSS size, e.g., "1000px")       |
| `height`       | `string`    | `undefined` | Stage height (CSS size, e.g., "400px")         |
| `padding`      | `string`    | `undefined` | Inner padding (CSS size, e.g., "24px")         |
| `radius`       | `string`    | `undefined` | Border radius (CSS size, e.g., "20px")         |
| `bgStart`      | `string`    | `undefined` | Gradient start color (e.g., "#141527")         |
| `bgEnd`        | `string`    | `undefined` | Gradient end color (e.g., "#101320")           |
| `pulseEnabled` | `boolean`   | `true`      | Enable/disable pulsing background highlight    |
| `pulseSize`    | `string`    | `undefined` | Size of pulse effect (CSS size, e.g., "640px") |
| `children`     | `ReactNode` | -           | Content to render inside the stage             |

#### CSS Variables

The component uses CSS custom properties for theming:

- `--stage-max-w`: Maximum width
- `--stage-h`: Height
- `--stage-pad`: Padding
- `--stage-radius`: Border radius
- `--stage-bg-start`: Gradient start color
- `--stage-bg-end`: Gradient end color
- `--stage-pulse-size`: Pulse effect size
- `--stage-pulse-enabled`: Pulse enabled (1 or 0)

#### Example

```tsx
<TarotStage
  maxWidth="1000px"
  height="400px"
  padding="24px"
  radius="20px"
  bgStart="#141527"
  bgEnd="#101320"
  pulseEnabled={true}
  pulseSize="640px"
>
  {/* TarotWheel goes here */}
</TarotStage>
```

---

### TarotWheel

The main component that handles all wheel logic, scrolling, physics, and card selection.

#### Props

| Prop              | Type                             | Default      | Description                                                               |
| ----------------- | -------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `cards`           | `TarotWheelCard[]`               | **required** | Array of card objects to display                                          |
| `onCardSelect`    | `(card: TarotWheelCard) => void` | `undefined`  | Callback fired after card flip animation completes                        |
| `spacing`         | `number`                         | `100`        | Distance between adjacent cards in pixels (controls scroll speed/density) |
| `rayAngle`        | `number`                         | `90`         | Maximum angle of the arc rays in degrees (affects contour shape)          |
| `flipDurationMs`  | `number`                         | `1500`       | Duration of card flip animation in milliseconds                           |
| `inertiaFriction` | `number`                         | `0.95`       | Friction coefficient for inertia (0-1, higher = longer spinning)          |
| `inertiaStopV`    | `number`                         | `5`          | Velocity threshold below which inertia stops                              |

#### TarotWheelCard Interface

```typescript
interface TarotWheelCard {
  id: string | number; // Unique identifier
  image: string; // Image URL/path
  alt: string; // Alt text for accessibility
}
```

#### State Management

The component manages several internal states:

1. **Scroll State**:

   - `scrollOffset`: Current scroll position
   - `accScrollOffset`: Accumulated scroll (during drag)
   - `targetScrollRef`: Target scroll position
   - `displayScrollRef`: Smoothed display scroll

2. **Selection State**:

   - `selectedCard`: Currently selected card (null if none)
   - `isFlipping`: Whether flip animation is active
   - `showFullCard`: Whether to show full card overlay

3. **Interaction State**:
   - `isDragging`: Is user currently dragging?
   - `hasMoved`: Has drag moved (prevents accidental clicks)
   - `velocity`: Current scroll velocity
   - `isInertia`: Is inertia animation active?

#### Physics System

**Drag & Scroll**:

- Users drag vertically to scroll through cards
- Movement is captured via Pointer Events API
- Scroll position is clamped to valid range (0 to maxScroll)

**Inertia**:

- Velocity is calculated from last 6 movement samples
- After drag release, inertia animation takes over
- Friction is applied each frame: `velocity *= inertiaFriction`
- Stops when velocity drops below `inertiaStopV`

**Smoothing**:

- Display scroll smoothly interpolates toward target scroll
- Uses alpha blending: `display += (target - display) * 0.25`
- Provides smooth visual movement even during rapid changes

#### Card Selection Flow

1. User taps the **centered card** (card under the indicator)
2. Wheel stops scrolling/inertia
3. `selectedCard` and `isFlipping` states are set
4. Flip animation plays for `flipDurationMs`
5. After flip completes:
   - `isFlipping` → false
   - `showFullCard` → true
   - `onCardSelect` callback is fired
6. User can click "Draw Another Card" to reset

#### Example

```tsx
<TarotWheel
  cards={wheelCards}
  onCardSelect={(card) => console.log("Selected:", card)}
  spacing={100}
  rayAngle={90}
  flipDurationMs={1500}
  inertiaFriction={0.95}
  inertiaStopV={5}
/>
```

---

### TarotCard

Individual card component with 3D positioning, rotation, and flip animations.

#### Props

| Prop               | Type             | Default      | Description                                          |
| ------------------ | ---------------- | ------------ | ---------------------------------------------------- |
| `card`             | `TarotWheelCard` | **required** | Card data (id, image, alt)                           |
| `offsetFromCenter` | `number`         | **required** | Distance from center position in pixels              |
| `rayAngle`         | `number`         | **required** | Arc ray angle in degrees (for geometry)              |
| `isCentered`       | `boolean`        | **required** | Is this card under the center indicator?             |
| `isFlipping`       | `boolean`        | **required** | Is flip animation active?                            |
| `hasSelectedCard`  | `boolean`        | **required** | Is any card selected? (disables interaction)         |
| `onClick`          | `() => void`     | **required** | Click handler (only fires if centered & interactive) |
| `arcRadius`        | `number`         | `300`        | Radius of the arc contour                            |
| `className`        | `string`         | `undefined`  | Additional CSS classes                               |

#### Geometry Calculation

The card position is calculated using the `arrangeByAngleContour` function:

1. Takes `offsetFromCenter` (distance along contour)
2. Returns `{ x, y, rotationDeg }`
3. Applied as CSS transform: `translate(x, y) rotate(rotation)`

**Memoization**: Position is memoized to prevent unnecessary recalculations during scroll.

#### Card Structure

```html
<div class="spinning-wheel__card">
  <div class="spinning-wheel__card-inner">
    <div class="spinning-wheel__card-back">
      <!-- Card back with pattern -->
    </div>
    <div class="spinning-wheel__card-front">
      <!-- Card front with image -->
    </div>
  </div>
</div>
```

#### States & Classes

- `.spinning-wheel__card--centered`: Applied when card is under indicator (adds glow effect)
- `.spinning-wheel__card--flipping`: Applied during flip animation
- Transform applied via inline styles for performance

#### Accessibility

- Centered cards have `role="button"` and `tabIndex={0}`
- Keyboard support: Enter and Space keys trigger selection
- `aria-label` provides context: "Select card [name]"
- Non-centered cards are not keyboard focusable (`tabIndex={-1}`)

---

## Geometry System

The `arrangeByAngleContour` function creates the arc contour shape.

### How It Works

The contour consists of two parts:

1. **Arc Section** (when `s <= L_arc`):

   - Cards follow a circular arc
   - Arc length: `L_arc = R × θ_max`
   - Position: `x = R sin(θ)`, `y = R(1 - cos(θ))`
   - Rotation: `θ` (tangent to arc)

2. **Ray Section** (when `s > L_arc`):
   - Cards continue in straight lines
   - Position extends from arc endpoint
   - Rotation fixed at `rayAngle`

### Parameters

```typescript
interface AngleContourOptions {
  R: number; // Arc radius (default: 300)
  rayAngleDeg: number; // Max angle in degrees (default: 90)
}
```

### Result

```typescript
interface AngleContourResult {
  x: number; // Horizontal position
  y: number; // Vertical position
  rotationDeg: number; // Rotation in degrees
}
```

### Visualization

```
        ╭──────╮  (apex, s=0)
       ╱        ╲
      │          │  ← Arc (curved)
     │            │
    │              │
   ╱                ╲  ← Transition point (s = L_arc)
  ╱                  ╲
 ╱                    ╲ ← Rays (straight)
```

### Adjusting the Shape

- **Increase `R`**: Wider, more gradual curve
- **Decrease `R`**: Tighter, sharper curve
- **Increase `rayAngle`**: Cards spread more to the sides
- **Decrease `rayAngle`**: Cards stay more vertical

---

## Configuration Guide

### Basic Setup

```tsx
import {
  TarotStage,
  TarotWheel,
  TarotWheelCard,
} from "@/components/tarot/tarot-wheel";

const cards: TarotWheelCard[] = [
  { id: 1, image: "/path/to/card1.jpg", alt: "The Fool" },
  { id: 2, image: "/path/to/card2.jpg", alt: "The Magician" },
  // ... more cards
];

function MyTarotPage() {
  return (
    <TarotStage>
      <TarotWheel cards={cards} onCardSelect={(card) => console.log(card)} />
    </TarotStage>
  );
}
```

### Customizing Visual Style

```tsx
<TarotStage
  maxWidth="1200px" // Wider stage
  height="500px" // Taller stage
  padding="32px" // More padding
  radius="24px" // Larger border radius
  bgStart="#0f0e17" // Dark gradient start
  bgEnd="#1a1a2e" // Dark gradient end
  pulseEnabled={true} // Keep pulse
  pulseSize="800px" // Larger pulse
>
  <TarotWheel cards={cards} />
</TarotStage>
```

### Adjusting Wheel Physics

```tsx
<TarotWheel
  cards={cards}
  spacing={120} // More space = slower scroll, less dense
  rayAngle={75} // Less spread
  flipDurationMs={2000} // Slower flip
  inertiaFriction={0.97} // Longer inertia
  inertiaStopV={3} // More gradual stop
/>
```

### Tuning Parameters

#### `spacing` (Scroll Speed & Density)

- **Lower (50-80)**: Cards close together, fast scrolling
- **Medium (80-120)**: Balanced spacing
- **Higher (120-200)**: Cards far apart, slow scrolling

#### `rayAngle` (Arc Shape)

- **45°**: Very tight, vertical spread
- **90°**: Balanced arc (default)
- **120°**: Wide, horizontal spread

#### `inertiaFriction` (Spin Duration)

- **0.90**: Quick stop
- **0.95**: Medium (default)
- **0.98**: Long, smooth spin

#### `inertiaStopV` (Stop Threshold)

- **2-3**: Very gradual stop
- **5**: Balanced (default)
- **8-10**: Abrupt stop

---

## Usage Examples

### Full Example

```tsx
import { FC, useCallback } from "react";
import {
  TarotStage,
  TarotWheel,
  TarotWheelCard,
} from "@/components/tarot/tarot-wheel";

const wheelCards: TarotWheelCard[] = [
  { id: 0, image: "/assets/major_arcana/the_fool.jpg", alt: "The Fool" },
  {
    id: 1,
    image: "/assets/major_arcana/the_magician.jpg",
    alt: "The Magician",
  },
  // ... 76 more cards
];

export const TarotPage: FC = () => {
  const handleCardSelect = useCallback((card: TarotWheelCard) => {
    console.log("Selected card:", card);
    // Send to analytics, save to state, etc.
  }, []);

  return (
    <Page>
      <TarotStage
        maxWidth="1000px"
        height="400px"
        padding="24px"
        radius="20px"
        bgStart="#141527"
        bgEnd="#101320"
        pulseEnabled={true}
        pulseSize="640px"
      >
        <header style={{ textAlign: "center" }}>
          <h1>Tarot Reading</h1>
          <p>Spin the wheel and select your destiny card</p>
        </header>

        <TarotWheel
          cards={wheelCards}
          onCardSelect={handleCardSelect}
          spacing={100}
          rayAngle={90}
          flipDurationMs={1500}
          inertiaFriction={0.95}
          inertiaStopV={5}
        />
      </TarotStage>
    </Page>
  );
};
```

### Custom Card Renderer

If you need custom card rendering, you can create a wrapper:

```tsx
const CustomTarotCard = (props: TarotCardProps) => {
  return (
    <TarotCard
      {...props}
      arcRadius={400} // Custom arc radius
      className="my-custom-card"
    />
  );
};

// Use in TarotWheel by forking the component
```

---

## Styling

### SCSS Architecture

The component uses SCSS with CSS custom properties for theming:

**TarotWheel.scss**:

- Card dimensions (`--twl-card-w`, `--twl-card-h`)
- Colors (`--twl-glow`, `--twl-bg1`, `--twl-bg2`)
- Layout (`--twl-pad-top`, `--twl-indicator-bottom`)
- Responsive breakpoints (768px, 480px)

**TarotStage.scss**:

- Stage dimensions (`--stage-max-w`, `--stage-h`)
- Background colors (`--stage-bg-start`, `--stage-bg-end`)
- Pulse effect (`--stage-pulse-size`, `--stage-pulse-enabled`)

### Customizing Colors

Override CSS variables in your app:

```scss
:root {
  // Wheel colors
  --twl-glow: rgba(255, 100, 50, 0.9); // Orange glow
  --twl-glow-strong: rgba(255, 100, 50, 1);
  --twl-bg1: #3d2b1f; // Brown background
  --twl-bg2: #6f4e37;

  // Stage colors
  --stage-bg-start: #1a0e0a;
  --stage-bg-end: #2d1810;
}
```

### Responsive Design

The component automatically adjusts card sizes at breakpoints:

- **Desktop (>768px)**: 110×165px cards
- **Tablet (≤768px)**: 90×135px cards
- **Mobile (≤480px)**: 70×105px cards

### Accessibility Features

- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **Keyboard Navigation**: Centered cards are keyboard accessible
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Clear focus states for interactive elements

---

## Accessibility

### Keyboard Support

- **Tab**: Navigate to centered card (when available)
- **Enter/Space**: Select the centered card
- **Drag/Scroll**: Works with mouse, touch, and pointer devices

### ARIA Attributes

- `role="button"`: Applied to centered, interactive cards
- `aria-label`: Descriptive label for each card
- `aria-pressed`: False for unselected interactive cards
- `aria-live="polite"`: Wheel announces changes to screen readers
- `aria-modal="true"`: Full card overlay is modal dialog

### Screen Reader Support

- Cards announce their name when focused
- Selection is announced via `aria-live` region
- Modal overlay traps focus appropriately

### Motion Preferences

```scss
@media (prefers-reduced-motion: reduce) {
  .spinning-wheel *,
  .tarot-stage * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Technical Notes

### Performance Optimizations

1. **Memoization**: Card geometry is memoized via `useMemo`
2. **requestAnimationFrame**: Smooth 60fps animations
3. **CSS transforms**: Hardware-accelerated positioning
4. **will-change**: Hints browser about transform changes
5. **Pointer Events**: Modern, efficient event handling

### Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Requires CSS custom properties support
- Uses Pointer Events API (polyfill for older browsers if needed)
- 3D transforms (`perspective`, `preserve-3d`, `backface-visibility`)

### Known Limitations

- Maximum ~100 cards recommended for performance
- Touch/pointer events only (no mouse wheel scroll)
- Requires JavaScript enabled

---

## Troubleshooting

### Cards not appearing?

- Ensure `cards` array is populated with valid `TarotWheelCard` objects
- Check that image paths are correct
- Verify parent container has sufficient height

### Scrolling feels jerky?

- Adjust `inertiaFriction` (try 0.93-0.97)
- Reduce `spacing` for smoother small movements
- Check for other animations/JS running on page

### Cards positioned incorrectly?

- Verify `rayAngle` is reasonable (30-120°)
- Check `arcRadius` in TarotCard (try 250-400)
- Ensure parent has `overflow: visible` if needed

### Flip animation issues?

- Check `flipDurationMs` (try 1000-2000ms)
- Ensure CSS for `.spinning-wheel__card--flipping` is loaded
- Verify browser supports 3D transforms

---

## API Reference Summary

### Exported Components

```typescript
export { TarotStage } from "./TarotStage";
export { TarotCard } from "./TarotCard";
export { TarotWheel } from "./TarotWheel";
export { arrangeByAngleContour } from "./arrangeByAngleContour";
```

### Exported Types

```typescript
export type { TarotCardProps } from "./TarotCard";
export type { TarotWheelCard } from "./TarotWheel";
export type {
  AngleContourOptions,
  AngleContourResult,
} from "./arrangeByAngleContour";
```

---

## Contributing

When modifying the tarot wheel system:

1. **Test responsiveness** at 480px, 768px, 1024px, and 1920px
2. **Check accessibility** with keyboard and screen readers
3. **Verify motion preferences** (`prefers-reduced-motion`)
4. **Test with different card counts** (10, 50, 78, 100 cards)
5. **Update this README** if changing props or behavior

---

## License

Part of the Numero TMA project.
