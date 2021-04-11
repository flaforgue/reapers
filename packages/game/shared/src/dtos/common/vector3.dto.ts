import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class Vector3DTO {
  @Expose()
  public x: number = 0;

  @Expose()
  public y: number = 0;

  @Expose()
  public z: number = 0;
}
