import numerologyRoutes from './numerology.routes';

export { default as numerologyRoutes } from './numerology.routes';
export { calculate } from './numerology.controller';
export { getInterpretationForNumber, clearCache } from './numerology.service';

// Factory function to match the naming convention in server.ts
export function createNumerologyRoutes() {
  return numerologyRoutes;
}

