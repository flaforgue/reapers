import { EntityKind } from '@reapers/game-client';

const dimensions: Record<EntityKind, number> = {
  [EntityKind.Unknown]: 0,
  [EntityKind.Nest]: 0,
  [EntityKind.Player]: 1.4,
  [EntityKind.Spider]: 1,
};

export { dimensions };
