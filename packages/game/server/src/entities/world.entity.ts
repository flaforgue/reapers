import BaseEntity from './shared/base.entity';

export default class WorldEntity extends BaseEntity {
  public readonly width: number;
  public readonly depth: number;

  public constructor(width: number, depth: number) {
    super();
    this.depth = depth;
    this.width = width;
  }
}
