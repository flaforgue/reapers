import { v4 as uuidv4 } from 'uuid';

export default class Identifiable {
  public readonly id: string;

  public constructor() {
    this.id = uuidv4();
  }
}
