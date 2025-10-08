import { FC, ReactNode } from "react";
import "./Arc.scss";

export interface ArcProps {
  children?: ReactNode;
  arcDegrees?: number; // Total arc span in degrees
  radius?: number; // Radius of the arc
  startAngle?: number; // Starting angle (0 = right, 90 = bottom, 180 = left, 270 = top)
  className?: string;
  activeCardOffset?: number; // Y-axis offset for active card (default: -30px)
  maxRotation?: number; // Maximum rotation at the edges (default: 45 degrees)
  showDebugLines?: boolean; // Show debug lines and angles (default: false)
}

export const Arc: FC<ArcProps> = ({
  children,
  arcDegrees = 120,
  radius = 140,
  startAngle, // Optional override
  className = "",
  activeCardOffset = -30,
  maxRotation = 45,
  showDebugLines = true,
}) => {
  const childArray = Array.isArray(children) ? children : children ? [children] : [];
  const totalCards = childArray.length;
  const angleStep = totalCards > 1 ? arcDegrees / (totalCards - 1) : 0;

  // Calculate center point for positioning
  const centerX = 0;
  const centerY = 0;

  // Default: center arc at 270° (top), so arc curves upward horizontally
  // For 160° arc: starts at 190° (bottom-left), ends at 350° (bottom-right)
  const calculatedStartAngle = startAngle ?? (270 - arcDegrees / 2);

  // Find the card closest to 270° (vertical top position)
  let activeCardIndex = 0;
  let minAngleDiff = Infinity;

  childArray.forEach((_, index) => {
    const angle = calculatedStartAngle + index * angleStep;
    // Normalize angle to 0-360 range
    const normalizedAngle = ((angle % 360) + 360) % 360;
    // Calculate distance to 270° (top position)
    const diff = Math.abs(normalizedAngle - 270);
    if (diff < minAngleDiff) {
      minAngleDiff = diff;
      activeCardIndex = index;
    }
  });

  return (
    <div className={`tarot-arc ${className}`}>
      {/* Debug visualization */}
      {showDebugLines && (
        <svg
          className="tarot-arc__debug"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          {childArray.map((_, index) => {
            const angle = calculatedStartAngle + index * angleStep;
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            const normalizedAngle = ((angle % 360) + 360) % 360;
            const isActive = index === activeCardIndex;
            
            return (
              <g key={`debug-${index}`}>
                {/* Line from center to card */}
                <line
                  x1="50%"
                  y1="100%"
                  x2={`calc(50% + ${x}px)`}
                  y2={`calc(100% + ${y}px)`}
                  stroke={isActive ? '#cbbbe2' : 'rgba(136, 106, 189, 0.3)'}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? '0' : '4 2'}
                />
                {/* Angle text */}
                <text
                  x={`calc(50% + ${x * 0.7}px)`}
                  y={`calc(100% + ${y * 0.7}px)`}
                  fill={isActive ? '#cbbbe2' : '#886abd'}
                  fontSize="10"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {normalizedAngle.toFixed(1)}°
                </text>
              </g>
            );
          })}
          {/* Center point indicator */}
          <circle
            cx="50%"
            cy="100%"
            r="3"
            fill="#cbbbe2"
          />
        </svg>
      )}
      
      {childArray.map((child, index) => {
        // Calculate angle for this card
        const angle = calculatedStartAngle + index * angleStep;
        
        // Convert polar to Cartesian coordinates
        const rad = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);

        // Check if this is the active card and apply offset
        const isActive = index === activeCardIndex;
        const yOffset = isActive ? activeCardOffset : 0;

        // Calculate card rotation for natural fan effect
        // Cards tilt based on their distance from the active position (270°)
        const normalizedAngle = ((angle % 360) + 360) % 360;
        
        // Calculate rotation: cards align tangent to the arc
        // At 270° (top/active): 0° rotation (upright)
        // Left of 270°: negative rotation (tilt left)
        // Right of 270°: positive rotation (tilt right)
        let cardRotation = normalizedAngle - 270;
        
        // Normalize rotation to -180 to 180 range
        if (cardRotation > 180) cardRotation -= 360;
        if (cardRotation < -180) cardRotation += 360;
        
        // Apply max rotation limit for a more natural look
        const rotationFactor = Math.min(Math.abs(cardRotation) / (arcDegrees / 2), 1);
        const limitedRotation = Math.sign(cardRotation) * rotationFactor * maxRotation;

        return (
          <div
            key={index}
            className={`tarot-arc__item ${isActive ? 'tarot-arc__item--active' : ''}`}
            style={{
              transform: `translate(calc(-50% + ${x}px), ${y + yOffset}px) rotate(${limitedRotation}deg)`,
              zIndex: index, // Progressive z-index from left to right
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

