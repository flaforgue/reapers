import { Exclude, Expose, Type } from 'class-transformer';
import MonsterGeneratorDTO from './monster-generator.dto';
import CharacterDTO from './common/character.dto';
import WorldDTO from './world.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => CharacterDTO)
  public players: CharacterDTO[] = [];

  @Expose()
  @Type(() => MonsterGeneratorDTO)
  public monsterGenerators: MonsterGeneratorDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();

  @Expose()
  public frameIndex = 0;
}
