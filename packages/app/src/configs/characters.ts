import { EntityKind } from '@reapers/game-client';

const labelPositions: Record<EntityKind, number> = {
  [EntityKind.Unknown]: 0,
  [EntityKind.World]: 0,
  [EntityKind.Nest]: 0,
  [EntityKind.Player]: 1.4,
  [EntityKind.Spider]: 1,
};

export { labelPositions };
