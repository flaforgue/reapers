import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import {
  MonsterGeneratorDTO,
  MonsterDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
} from './dtos';
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
  BoundedValueDTO,
  CharacterDTO,
  MonsterDTO,
  MonsterGeneratorDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  WorldDTO,
  plainToClass,
};
