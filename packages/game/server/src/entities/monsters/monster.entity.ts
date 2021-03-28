import * as BABYLON from 'babylonjs';
import MovableEntity from '../shared/movable.entity';

export default class MonsterEntity extends MovableEntity {
  public constructor(
    name: string,
    mesh: BABYLON.Mesh,
    position: number[],
    rotation: number[],
  ) {
    super(name, mesh, position, rotation);
  }
}
