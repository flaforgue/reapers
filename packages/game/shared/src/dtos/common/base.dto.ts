import { Exclude, Expose } from 'class-transformer';
import { EntityKind } from '../../types';

@Exclude()
export default class BaseDTO {
  @Expose()
  public id: string = '';

  @Expose()
  public kind: EntityKind = EntityKind.Unknown;
}
