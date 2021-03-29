import { v4 as uuidv4 } from 'uuid';

export default class BaseEntity {
  public readonly id = uuidv4();
}
