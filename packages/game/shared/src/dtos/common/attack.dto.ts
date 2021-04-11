import { Exclude, Expose, Type } from 'class-transformer';
import { CharacterKind } from '../..';
import BaseDTO from './base.dto';
import Vector3DTO from './vector3.dto';

@Exclude()
export default class AttackDTO extends BaseDTO {
  @Expose()
  targetId: string = '';

  @Expose()
  targetKind: CharacterKind = CharacterKind.Player;

  @Expose()
  @Type(() => Vector3DTO)
  public targetPosition: Vector3DTO = {
    x: 0,
    y: 0,
    z: 0,
  };

  @Expose()
  timeToHit: number = 0;

  @Expose()
  timeToCast: number = 0;

  @Expose()
  damageAmount: number = 0;
}
