import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import { CharacterDTO, MonsterDTO, PlayerDTO, GameDTO, WorldDTO } from './dtos';
import { CharacterKind, GameEvents, MoveDirection, RotationDirection } from './types';

export {
  CharacterKind,
  CharacterDTO,
  GameDTO,
  GameEvents,
  MoveDirection,
  PlayerDTO,
  MonsterDTO,
  RotationDirection,
  WorldDTO,
  plainToClass,
};
