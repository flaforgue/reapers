import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class BoundedValueDTO {
  @Expose()
  public min = 1;

  @Expose()
  public max = 1;

  @Expose()
  public value = 1;
}
