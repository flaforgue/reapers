import { Exclude, Expose, Type } from 'class-transformer';
import { CharacterKind } from '../..';
import IdentifiableDTO from '../identifiable.dto';
import Vector3DTO from './vector3.dto';

@Exclude()
export default class AttackDTO extends IdentifiableDTO {
  @Expose()
  public targetId = '';

  @Expose()
  public targetKind: CharacterKind = CharacterKind.Player;

  @Expose()
  public isTargetAlive = true;

  @Expose()
  @Type(() => Vector3DTO)
  public targetPosition: Vector3DTO = {
    x: 0,
    y: 0,
    z: 0,
  };

  @Expose()
  public timeToHit = 0;

  @Expose()
  public timeToCast = 0;

  @Expose()
  public damageAmount = 0;
}
