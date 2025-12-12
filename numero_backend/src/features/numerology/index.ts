import numerologyRoutes from './numerology.routes';

export { default as numerologyRoutes } from './numerology.routes';
export { calculate } from './numerology.controller';
export { getInterpretationForNumber, clearCache } from './numerology.service';

export function createNumerologyRoutes() {
  return numerologyRoutes;
}

