import { Exclude, Expose } from 'class-transformer';
import BaseDTO from './base.dto';

export default class PositionableDTO extends BaseDTO {
  @Expose()
  public position: number[] = [0, 0, 0];

  @Expose()
  public rotation: number[] = [0, 0, 0];
}
