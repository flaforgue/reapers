import { Exclude, Expose, Type } from 'class-transformer';
import PlayerDTO from './player.dto';
import WorldDTO from './world.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();

  @Expose()
  public frameIndex = 0;
}
