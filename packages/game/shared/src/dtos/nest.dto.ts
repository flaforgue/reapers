import { Exclude, Expose, Type } from 'class-transformer';
import CharacterDTO from './common/character.dto';
import PositionableDTO from './common/positionable.dto';

@Exclude()
export default class NestDTO extends PositionableDTO {
  @Expose()
  @Type(() => CharacterDTO)
  public monsters: CharacterDTO[] = [];
}
