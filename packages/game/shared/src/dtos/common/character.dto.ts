import { Exclude, Expose, Type } from 'class-transformer';
import {
  FrontMoveDirection,
  SideMoveDirection,
  RotationDirection,
  CharacterKind,
} from '../../types';
import AttackDTO from './attack.dto';
import BoundedValueDTO from './bounded-value.dto';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class CharacterDTO extends PositionableDTO {
  @Expose()
  public name = '';

  @Expose()
  public level = 1;

  @Expose()
  @Type(() => BoundedValueDTO)
  public life = new BoundedValueDTO();

  @Expose()
  public attackRange = 0;

  @Expose()
  public attackLinearSpeed = 0;

  @Expose()
  public attackTimeToCast = 0;

  @Expose()
  public kind: CharacterKind = CharacterKind.Player;

  @Expose()
  @Type(() => AttackDTO)
  public currentAttack: AttackDTO | null = null;

  @Expose()
  public isAttacking: boolean = false;

  @Expose()
  public frontMoveDirection: FrontMoveDirection = FrontMoveDirection.None;

  @Expose()
  public sideMoveDirection: SideMoveDirection = SideMoveDirection.None;

  @Expose()
  public rotationDirection: RotationDirection = RotationDirection.None;
}
