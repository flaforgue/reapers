import Identifiable from './shared/identifiable';

export default class World extends Identifiable {
  public readonly width: number;
  public readonly depth: number;

  public constructor(width: number, depth: number) {
    super();
    this.depth = depth;
    this.width = width;
  }
}
