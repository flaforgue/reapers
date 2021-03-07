import { v4 as uuidv4 } from 'uuid';
import { Identifiable } from '../types';

export default class WorldEntity implements Identifiable {
  public readonly id = uuidv4();
  public readonly width: number;
  public readonly depth: number;

  public constructor(width: number, depth: number) {
    this.depth = depth;
    this.width = width;
  }
}
