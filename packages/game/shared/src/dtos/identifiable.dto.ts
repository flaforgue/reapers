import { Exclude, Expose } from 'class-transformer';

@Exclude()
export default class IdentifiableDTO {
  @Expose()
  public id = '';
}
