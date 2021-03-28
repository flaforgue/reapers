import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import { MovableDTO, MonsterDTO, NestDTO, PlayerDTO, GameDTO, WorldDTO } from './dtos';
import {
  EntityKind,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
} from './types';

export {
  EntityKind,
  MovableDTO,
  NestDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  PlayerDTO,
  MonsterDTO,
  RotationDirection,
  WorldDTO,
  plainToClass,
};
