import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterGenerator from '../monster-generator';
import BoundedValue from '../shared/bounded-value';
import Monster from './monster';

export default class Frog extends Monster {
  public readonly attackLinearSpeed: number = 0;
  public readonly attackTimeToCast: number = 0.7;

  protected readonly _kind: CharacterKind = CharacterKind.Frog;

  public constructor(
    scene: BABYLON.Scene,
    level: number,
    generator: MonsterGenerator,
    position?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3,
  ) {
    super(
      CharacterKind.Frog,
      level,
      new BABYLON.Mesh('', scene),
      generator,
      position,
      rotation,
    );

    this.speedFactor.current = 1.5;
  }

  protected _createLifeBoudedValue() {
    return new BoundedValue(0, 100 + 8 * this.level);
  }

  protected _createAttackDamageAmount() {
    return 8 + this.level;
  }
}
