import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import BoundedValue from '../shared/bounded-value';
import Monster from './monster';

export default class Spider extends Monster {
  public readonly attackLinearSpeed: number = 0;
  public readonly attackTimeToCast: number = 0.6;

  protected readonly _kind: CharacterKind = CharacterKind.Spider;

  public constructor(
    scene: BABYLON.Scene,
    level: number,
    position?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3,
  ) {
    super(CharacterKind.Spider, level, new BABYLON.Mesh('', scene), position, rotation);

    this.speedFactor.current = 2;
  }

  protected _createLifeBoudedValue() {
    return new BoundedValue(0, 100 + 5 * this.level);
  }

  protected _createAttackDamageAmount() {
    return 11 + this.level;
  }
}
