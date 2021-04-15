import { PawnKind } from '../../types';
import { Exclude, Expose } from 'class-transformer';
import PositionableDTO from '../positionable.dto';

@Exclude()
export default class PawnDTO extends PositionableDTO {
  @Expose()
  public kind: PawnKind = PawnKind.PineTree;
}
