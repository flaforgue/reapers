import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import PlayerDTO from './dtos/player';
import GameDTO from './dtos/game';
import WorldDTO from './dtos/world';

// Reserved names, do not change
enum SystemEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
}

enum PlayerEvent {
  Created = 'PlayerEvent.Created',
  Deleted = 'PlayerEvent.Deleted',
  Joined = 'PlayerEvent.Joined',
}

enum GameEvent {
  Created = 'GameEvent.Created',
  Updated = 'GameEvent.Updated',
  Stopped = 'GameEvent.Stopped',
}

export { plainToClass, GameDTO, GameEvent, PlayerDTO, PlayerEvent, SystemEvent, WorldDTO };
