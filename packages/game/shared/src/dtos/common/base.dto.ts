import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class BaseDTO {
  @Expose()
  public id: string = '';
}
