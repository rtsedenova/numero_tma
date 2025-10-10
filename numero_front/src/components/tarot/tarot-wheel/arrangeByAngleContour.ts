/**
 * Рассчитывает позицию и вращение для элементов, расположенных вдоль контура дуги.
 * Контур состоит из закругленной дуги вверху, которая переходит в параллельные вертикальные лучи.  
 * 
 * @param s - Расстояние пройденное по контуру (0 = apex)
 * @param options - Конфигурация опций
 * @param options.R - Радиус дуги
 * @param options.rayAngleDeg - Максимальный угол дуги в градусах (лучи продолжаются вертикально от конца дуги)
 * @param options.rayLength - Длина вертикального луча (опционально, для валидации)
 * @returns Позиция (x, y) и вращение в градусах
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
  // Конвертируем максимальный угол в радианы
  const thetaMaxRad = (rayAngleDeg * Math.PI) / 180;
  
  // Длина дуги: L_arc = R * thetaMax
  const L_arc = R * thetaMaxRad;
  
  if (s <= L_arc) {
    // На дуге
    const theta = s / R;
    
    return {
      x: R * Math.sin(theta),
      y: R - R * Math.cos(theta),
      rotationDeg: (theta * 180) / Math.PI
    };
  } else {
    // На луче (за пределами дуги) - параллельные вертикальные лучи
    const sRay = s - L_arc;
    
    // Конечная позиция дуги
    const arcEndX = R * Math.sin(thetaMaxRad);
    const arcEndY = R - R * Math.cos(thetaMaxRad);
    
    return {
      x: arcEndX,              // Сохраняем X постоянным (параллельные лучи)
      y: arcEndY + sRay,       // Двигаемся прямо вниз
      rotationDeg: 90          // Вертикальная ориентация
    };
  }
}

