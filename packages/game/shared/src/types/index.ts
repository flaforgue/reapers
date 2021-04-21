// Reserved names, do not change
enum SystemEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

enum PlayerEvent {
  Created = 'PlayerEvent.Created',
  Deleted = 'PlayerEvent.Deleted',
  Joined = 'PlayerEvent.Joined',
  FrontMoveDirectionUpdated = 'PlayerEvent.FrontMoveDirectionUpdated',
  SideMoveDirectionUpdated = 'PlayerEvent.SideMoveDirectionUpdated',
  RotationUpdated = 'PlayerEvent.RotationUpdated',
  AttackLoaded = 'PlayerEvent.AttackLoaded',
  AttackPerformed = 'PlayerEvent.AttackPerformed',
}

enum GameEvent {
  Created = 'GameEvent.Created',
  Updated = 'GameEvent.Updated',
  Stopped = 'GameEvent.Stopped',
}

export const GameEvents = {
  Game: GameEvent,
  Player: PlayerEvent,
  System: SystemEvent,
};

export enum FrontMoveDirection {
  None = 0,
  Forward = 1,
  Backward = -1,
}

export enum SideMoveDirection {
  None = 0,
  Right = 1,
  Left = -1,
}

export enum AttackState {
  Loading = 'Loading',
  Casting = 'Casting',
  Hitting = 'Hitting',
}

export enum CharacterKind {
  Player = 'Player',
  Spider = 'Spider',
  Frog = 'Frog',
}

export enum MonsterKind {
  Spider = 'Spider',
  Frog = 'Frog',
}

export enum PawnKind {
  PineTree = 'PineTree',
  // CommonTree = 'CommonTree',
  // DeadTree = 'DeadTree',
  // Wall = 'Wall',
  // SpiderNest = 'SpiderNest',
}
