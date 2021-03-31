import { Exclude, Expose, Type } from 'class-transformer';
import CharacterDTO from './common/character.dto';
import PositionableDTO from './common/positionable.dto';
import MonsterDTO from './monster.dto';

@Exclude()
export default class NestDTO extends PositionableDTO {
  @Expose()
  @Type(() => MonsterDTO)
  public monsters: MonsterDTO[] = [];
}
