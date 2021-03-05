import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class PlayerDTO {
  @Expose()
  public id: string | null = null;

  @Expose()
  public name = '';
}
