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
} from './types';

export {
  PawnKind,
  CharacterKind,
  MonsterKind,
  AttackDTO,
  BoundedValueDTO,
  CharacterDTO,
  GameDTO,
  GameEvents,
  FrontMoveDirection,
  SideMoveDirection,
  WorldDTO,
  PawnDTO,
  plainToClass,
};
