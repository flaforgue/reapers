import { PawnKind } from '../../types';
import { Exclude, Expose, Type } from 'class-transformer';
import PositionableDTO from '../positionable.dto';
import Vector3DTO from '../common/vector3.dto';

@Exclude()
export default class PawnDTO extends PositionableDTO {
  @Expose()
  public kind: PawnKind = PawnKind.PineTree;

  @Expose()
  @Type(() => Vector3DTO)
  public scaling: Vector3DTO = {
    x: 1,
    y: 1,
    z: 1,
  };
}
