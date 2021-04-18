import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class Vector3DTO {
  @Expose()
  public x = 0;

  @Expose()
  public y = 0;

  @Expose()
  public z = 0;
}
