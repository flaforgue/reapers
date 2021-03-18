import { Exclude, Expose } from 'class-transformer';
import MovableDTO from '../common/movable.dto';

@Exclude()
export default class MonsterDTO extends MovableDTO {
  @Expose()
  public name = '';
}
