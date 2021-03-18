import { Exclude, Expose } from 'class-transformer';
import { MoveDirection, RotationDirection } from '../../types';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class MovableDTO extends PositionableDTO {
  @Expose()
  public moveDirection: MoveDirection = MoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
