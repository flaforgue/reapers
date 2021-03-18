import { EntityKind } from '@reapers/game-shared';
import { v4 as uuidv4 } from 'uuid';

export default class BaseEntity {
  public readonly id = uuidv4();
  protected _kind: EntityKind = EntityKind.Unknown;

  public get kind(): EntityKind {
    return this._kind;
  }
}
