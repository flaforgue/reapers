import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import { NestDTO, CharacterDTO, GameDTO, WorldDTO } from './dtos';
import {
  EnvironmentKind,
  CharacterKind,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
} from './types';

export {
  EnvironmentKind,
  CharacterKind,
  CharacterDTO,
  NestDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  WorldDTO,
  plainToClass,
};
