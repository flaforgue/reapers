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
  SpellCasted = 'PlayerEvent.SpellCasted',
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
  None,
  Forward,
  Backward,
}

export enum SideMoveDirection {
  None,
  Left,
  Right,
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

export enum EnvironmentKind {
  Unknown = 'Unknown',
  MonsterGenerator = 'MonsterGenerator',
  World = 'World',
}
