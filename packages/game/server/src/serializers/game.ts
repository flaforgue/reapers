import { Expose, Exclude, Type } from 'class-transformer';
import PlayerDTO from './player';

@Exclude()
export default class GameSerializer {
  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[] = [];

  @Expose()
  public maxPlayers = 0;
}
