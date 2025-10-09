/**
 * Calculates position and rotation for items arranged along an angle contour.
 * The contour consists of a rounded arc at the top that transitions to straight rays.
 * 
 * @param s - Distance traveled along the contour (0 = apex)
 * @param options - Configuration options
 * @param options.R - Radius of the arc
 * @param options.rayAngleDeg - Maximum angle of the rays in degrees
 * @param options.rayLength - Length of the straight ray section (optional, for validation)
 * @returns Position (x, y) and rotation in degrees
 */
export interface AngleContourOptions {
  R: number;
  rayAngleDeg: number;
  rayLength?: number;
}

export interface AngleContourResult {
  x: number;
  y: number;
  rotationDeg: number;
}

export function arrangeByAngleContour(
  s: number,
  { R, rayAngleDeg }: AngleContourOptions
): AngleContourResult {
  // Convert max angle to radians
  const thetaMaxRad = (rayAngleDeg * Math.PI) / 180;
  
  // Arc length: L_arc = R * thetaMax
  const L_arc = R * thetaMaxRad;
  
  if (s <= L_arc) {
    // On the arc
    const theta = s / R;
    
    return {
      x: R * Math.sin(theta),
      y: R - R * Math.cos(theta),
      rotationDeg: (theta * 180) / Math.PI
    };
  } else {
    // On the ray (beyond the arc)
    const sRay = s - L_arc;
    
    // End position of the arc
    const arcEndX = R * Math.sin(thetaMaxRad);
    const arcEndY = R - R * Math.cos(thetaMaxRad);
    
    return {
      x: arcEndX + Math.sin(thetaMaxRad) * sRay,
      y: arcEndY + Math.cos(thetaMaxRad) * sRay,
      rotationDeg: rayAngleDeg
    };
  }
}

