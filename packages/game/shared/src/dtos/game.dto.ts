import { Exclude, Expose, Type } from 'class-transformer';
import MonsterDTO from './monster.dto';
import PlayerDTO from './player.dto';
import WorldDTO from './world.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[] = [];

  @Expose()
  @Type(() => MonsterDTO)
  public monsters: MonsterDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();

  @Expose()
  public frameIndex = 0;
}
