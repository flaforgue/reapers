import { Exclude, Expose } from 'class-transformer';
import MovableDTO from './common/movable.dto';

@Exclude()
export default class PlayerDTO extends MovableDTO {
  @Expose()
  public name = '';
}
