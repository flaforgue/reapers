import { Exclude, Expose, Type } from 'class-transformer';
import CharacterDTO from './character.dto';
import Vector3DTO from './common/vector3.dto';

@Exclude()
export default class MonsterDTO extends CharacterDTO {
  @Expose()
  @Type(() => Vector3DTO)
  public destination: Vector3DTO = {
    x: 0,
    y: 0,
    z: 0,
  };
}
