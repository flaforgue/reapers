import { Expose, Exclude } from 'class-transformer';

@Exclude()
export default class PlayerSerializer {
  @Expose()
  public id: string | null = null;

  @Expose()
  public name: string | null = null;
}
