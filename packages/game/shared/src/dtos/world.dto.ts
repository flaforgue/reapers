import { Exclude, Expose, Type } from 'class-transformer';
import PawnDTO from './pawns/pawn.dto';
import PositionableDTO from './positionable.dto';

@Exclude()
export default class WorldDTO extends PositionableDTO {
  @Expose()
  public width = 0;

  @Expose()
  public depth = 0;

  @Expose()
  @Type(() => PawnDTO)
  public pawns: PawnDTO[] = [];
}
