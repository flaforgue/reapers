import { Exclude, Expose } from 'class-transformer';
import CharacterDTO from './common/character.dto';

@Exclude()
export default class MonsterDTO extends CharacterDTO {
  @Expose()
  public destination: number[] = [0, 0, 0];
}
