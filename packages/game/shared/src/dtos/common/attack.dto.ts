import { Exclude, Expose } from 'class-transformer';
import { CharacterKind } from '../..';
import BaseDTO from './base.dto';

@Exclude()
export default class AttackDTO extends BaseDTO {
  @Expose()
  targetId: string = '';

  @Expose()
  targetKind: CharacterKind = CharacterKind.Player;

  @Expose()
  targetPosition: number[] = [0, 0, 0];

  @Expose()
  timeToHit: number = 0;

  @Expose()
  timeToCast: number = 0;

  @Expose()
  damageAmount: number = 0;
}
