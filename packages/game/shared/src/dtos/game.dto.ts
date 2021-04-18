import { Exclude, Expose, Type } from 'class-transformer';
import CharacterDTO from './character.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => CharacterDTO)
  public characters: CharacterDTO[] = [];
}
