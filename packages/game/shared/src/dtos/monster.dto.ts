import { Exclude, Expose } from 'class-transformer';
import CharacterDTO from './character.dto';

@Exclude()
export default class MonsterDTO extends CharacterDTO {
  @Expose()
  public name = '';
}
