import { CharacterKind } from '@reapers/game-client';

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

type AnyAnimationKey = typeof PlayerAnimationKey | typeof SpiderAnimationKey;

const animationKeys: Record<CharacterKind, AnyAnimationKey> = {
  [CharacterKind.Player]: PlayerAnimationKey,
  [CharacterKind.Spider]: SpiderAnimationKey,
};

export { animationKeys };
