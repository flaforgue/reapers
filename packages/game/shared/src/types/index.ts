// Reserved names, do not change
enum SystemEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

enum PlayerEvent {
  Created = 'PlayerEvent.Created',
  Deleted = 'PlayerEvent.Deleted',
  Joined = 'PlayerEvent.Joined',
  MoveDirectionUpdated = 'PlayerEvent.MoveDirectionUpdated',
  RotationDirectionUpdated = 'PlayerEvent.RotationDirectionUpdated',
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

export enum RotationDirection {
  None,
  Left,
  Right,
}

export enum MoveDirection {
  None,
  Forward,
  Backward,
  Left,
  Right,
}

export enum CharacterKind {
  Player = 'Player',
  Spider = 'Spider',
}
