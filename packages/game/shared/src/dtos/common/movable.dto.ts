import { Exclude, Expose } from 'class-transformer';
import { FrontMoveDirection, SideMoveDirection, RotationDirection } from '../../types';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class MovableDTO extends PositionableDTO {
  @Expose()
  public name = '';

  @Expose()
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;

  @Expose()
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
