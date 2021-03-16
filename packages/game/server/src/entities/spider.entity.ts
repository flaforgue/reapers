import { CharacterKind } from '@reapers/game-shared';
import * as BABYLON from 'babylonjs';
import CharacterEntity from './character.entity';
import MonsterEntity from './monster.entity';

export default class SpiderEntity extends MonsterEntity {
  public constructor(
    scene: BABYLON.Scene,
    position: number[],
    rotation: number[],
    name: string = CharacterKind.Spider,
  ) {
    super(scene, CharacterKind.Spider, name, position, rotation);
  }
}
