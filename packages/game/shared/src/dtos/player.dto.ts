import { Exclude, Expose } from 'class-transformer';
import { MoveDirection, RotationDirection } from '..';

@Exclude()
export default class PlayerDTO {
  @Expose()
  public id: string = '';

  @Expose()
  public name = '';

  @Expose()
  public position: number[] = [0, 0, 0];

  @Expose()
  public rotation: number[] = [0, 0, 0];

  @Expose()
  public moveDirection: MoveDirection = MoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
