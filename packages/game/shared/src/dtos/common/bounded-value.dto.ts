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
  public min = 0;

  @Expose()
  public max = 100;

  @Expose()
  public value = 100;
}
