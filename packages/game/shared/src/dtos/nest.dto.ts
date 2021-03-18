import { Exclude, Expose, Type } from 'class-transformer';
import MonsterDTO from './monsters/monster.dto';
import PositionableDTO from './common/positionable.dto';

@Exclude()
export default class NestDTO extends PositionableDTO {
  @Expose()
  @Type(() => MonsterDTO)
  public monsters: MonsterDTO[] = [];
}
