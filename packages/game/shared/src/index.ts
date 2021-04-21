import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import {
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
} from './dtos';
import {
  PawnKind,
  CharacterKind,
  MonsterKind,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  AttackState,
} from './types';

export {
  // types
  PawnKind,
  CharacterKind,
  MonsterKind,
  AttackState,
  FrontMoveDirection,
  SideMoveDirection,
  GameEvents,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  WorldDTO,
  PawnDTO,
  plainToClass,
};
