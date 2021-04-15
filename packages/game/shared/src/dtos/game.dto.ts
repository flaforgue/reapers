import { Exclude, Expose, Type } from 'class-transformer';
import CharacterDTO from './common/character.dto';
import WorldDTO from './world.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => CharacterDTO)
  public characters: CharacterDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();
}
