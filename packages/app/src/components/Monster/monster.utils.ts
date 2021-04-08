import { CharacterKind, MonsterKind } from '@reapers/game-client';

enum SpiderAnimationKey {
  Attack = 0,
  Idle = 1,
  Walk = 3,
}

enum FrogAnimationKey {
  Idle = 0,
  Walk = 1,
  Attack = 1,
}

type AnimationKeyType = typeof SpiderAnimationKey | typeof FrogAnimationKey;

const monsterAnimationKeys: Record<MonsterKind, AnimationKeyType> = {
  [CharacterKind.Spider]: SpiderAnimationKey,
  [CharacterKind.Frog]: FrogAnimationKey,
};

export { monsterAnimationKeys };
