import 'reflect-metadata';

import { plainToClass } from 'class-transformer';
import {
  AttackDTO,
  MonsterDTO,
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
} from './types';

export {
  PawnKind,
  CharacterKind,
  MonsterKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  MonsterDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  WorldDTO,
  PawnDTO,
  plainToClass,
};
