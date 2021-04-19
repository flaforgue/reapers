import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import MonsterGenerator from '../monster-generator';
import BoundedValue from '../shared/bounded-value';
import World from '../world';
import Monster from './monster';

export default class Spider extends Monster {
  public readonly attackLinearSpeed: number = 0;
  public readonly attackTimeToCast: number = 0.6;

  protected readonly _kind: CharacterKind = CharacterKind.Spider;

  public constructor(
    world: World,
    baseMesh: BABYLON.Mesh,
    level: number,
    generator: MonsterGenerator,
    position?: BABYLON.Vector3,
    rotation?: BABYLON.Vector3,
    scaling?: BABYLON.Vector3,
  ) {
    super(
      world,
      CharacterKind.Spider,
      level,
      baseMesh.createInstance(''),
      generator,
      position,
      rotation,
      scaling,
    );

    this.speedFactor.current = 2;
  }

  protected _createLifeBoudedValue(): BoundedValue {
    return new BoundedValue(0, 100 + 5 * this.level);
  }

  protected _createAttackDamageAmount(): number {
    return 11 + this.level;
  }
}
