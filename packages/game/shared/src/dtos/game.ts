import { Exclude, Expose, Type } from 'class-transformer';
import PlayerDTO from './player';
import WorldDTO from './world';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();

  @Expose()
  public maxPlayers = 0;
}
