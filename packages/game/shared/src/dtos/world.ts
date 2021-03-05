import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class WorldDTO {
  @Expose()
  public id: string | null = null;

  @Expose()
  public width = 0;

  @Expose()
  public depth = 0;
}
