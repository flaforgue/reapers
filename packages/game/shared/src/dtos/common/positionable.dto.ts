import { Exclude, Expose, Type } from 'class-transformer';
import Vector3DTO from './vector3.dto';
import BaseDTO from './base.dto';
@Exclude()
export default class PositionableDTO extends BaseDTO {
  @Expose()
  @Type(() => Vector3DTO)
  public position: Vector3DTO = {
    x: 0,
    y: 0,
    z: 0,
  };

  @Expose()
  @Type(() => Vector3DTO)
  public rotation: Vector3DTO = {
    x: 0,
    y: 0,
    z: 0,
  };
}
