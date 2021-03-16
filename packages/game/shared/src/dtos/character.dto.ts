import { Exclude, Expose } from 'class-transformer';
import { CharacterKind, MoveDirection, RotationDirection } from '..';

@Exclude()
export default class CharacterDTO {
  @Expose()
  public id: string = '';

  @Expose()
  public kind: CharacterKind = CharacterKind.Player;

  @Expose()
  public position: number[] = [0, 0, 0];

  @Expose()
  public rotation: number[] = [0, 0, 0];

  @Expose()
  public moveDirection: MoveDirection = MoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
