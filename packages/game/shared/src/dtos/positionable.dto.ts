import { Exclude, Expose, Type } from 'class-transformer';
import Vector3DTO from './common/vector3.dto';
import IdentifiableDTO from './identifiable.dto';

@Exclude()
export default class PositionableDTO extends IdentifiableDTO {
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
