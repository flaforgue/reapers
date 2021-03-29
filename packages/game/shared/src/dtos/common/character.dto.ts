import { Exclude, Expose } from 'class-transformer';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '../../types';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class CharacterDTO extends PositionableDTO {
  @Expose()
  public name = '';

  @Expose()
  public kind: CharacterKind = CharacterKind.Player;

  @Expose()
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;

  @Expose()
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
