import { Exclude, Expose, Type } from 'class-transformer';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '../../types';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class BoundedValueDTO {
  @Expose()
  public min = 1;

  @Expose()
  public max = 1;

  @Expose()
  public value = 1;
}
