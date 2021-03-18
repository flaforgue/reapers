import { Exclude, Expose, Type } from 'class-transformer';
import NestDTO from './nest.dto';
import PlayerDTO from './player.dto';
import WorldDTO from './world.dto';

@Exclude()
export default class GameDTO {
  @Expose()
  @Type(() => PlayerDTO)
  public players: PlayerDTO[] = [];

  @Expose()
  @Type(() => NestDTO)
  public nests: NestDTO[] = [];

  @Expose()
  @Type(() => WorldDTO)
  public world: WorldDTO = new WorldDTO();

  @Expose()
  public frameIndex = 0;
}
