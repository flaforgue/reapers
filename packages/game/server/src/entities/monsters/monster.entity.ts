import * as BABYLON from 'babylonjs';
import MovableEntity from '../shared/movable.entity';

export default class MonsterEntity extends MovableEntity {
  public readonly name: string = '';

  public constructor(
    scene: BABYLON.Scene,
    name: string,
    position: number[],
    rotation: number[],
  ) {
    super(scene, position, rotation);
    this.name = name;
  }
}
