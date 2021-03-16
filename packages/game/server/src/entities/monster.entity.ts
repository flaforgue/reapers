import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import CharacterEntity from './character.entity';

export default class MonsterEntity extends CharacterEntity {
  public readonly name: string = '';

  public constructor(
    scene: BABYLON.Scene,
    kind: CharacterKind,
    name: string,
    position: number[],
    rotation: number[],
  ) {
    super(scene, kind, position, rotation);
    this.name = name;
  }
}
