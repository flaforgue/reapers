import { v4 as uuidv4 } from 'uuid';

export default class Identifiable {
  public readonly id = uuidv4();
}
