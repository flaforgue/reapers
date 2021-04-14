import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import {
  AttackDTO,
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
  MonsterKind,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
} from './types';

export {
  EnvironmentKind,
  CharacterKind,
  MonsterKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  MonsterDTO,
  MonsterGeneratorDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  WorldDTO,
  plainToClass,
};
