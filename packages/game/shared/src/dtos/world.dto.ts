import { Exclude, Expose } from 'class-transformer';
import PositionableDTO from './common/positionable.dto';

@Exclude()
export default class WorldDTO extends PositionableDTO {
  @Expose()
  public width = 0;

  @Expose()
  public depth = 0;
}
