import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import { PlayerDTO, GameDTO, WorldDTO } from './dtos';
import { GameEvents, MoveDirection, RotationDirection } from './types';

export {
  GameDTO,
  GameEvents,
  MoveDirection,
  PlayerDTO,
  RotationDirection,
  WorldDTO,
  plainToClass,
};
