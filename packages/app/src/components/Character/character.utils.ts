import { EntityKind } from '@reapers/game-client';

enum UnknownAnimationKey {}

enum NestAnimationKey {
  Idle = 1,
}

enum PlayerAnimationKey {
  Defeat = 0,
  Idle = 1,
  Pickup = 2,
  Punch = 3,
  ReceiveHit = 4,
  Shoot = 5,
  SitDown = 6,
  StandUp = 7,
  Victory = 8,
  Walk = 9,
  WalkCarry = 10,
}

enum SpiderAnimationKey {
  Attack = 0,
  Idle = 1,
  Jump = 2,
  Walk = 3,
}

type AnyAnimationKey =
  | typeof PlayerAnimationKey
  | typeof SpiderAnimationKey
  | typeof UnknownAnimationKey
  | typeof NestAnimationKey;

const animationKeys: Record<EntityKind, AnyAnimationKey> = {
  [EntityKind.Unknown]: UnknownAnimationKey,
  [EntityKind.Nest]: NestAnimationKey,
  [EntityKind.Player]: PlayerAnimationKey,
  [EntityKind.Spider]: SpiderAnimationKey,
};

export { animationKeys };
