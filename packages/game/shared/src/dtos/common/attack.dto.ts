import { Exclude, Expose } from 'class-transformer';
import BaseDTO from './base.dto';

@Exclude()
export default class AttackDTO extends BaseDTO {
  @Expose()
  targetId: string = '';

  @Expose()
  targetPosition: number[] = [0, 0, 0];
}
