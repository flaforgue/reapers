import * as BABYLON from 'babylonjs';
import CharacterEntity from '../shared/character.entity';

export default class MonsterEntity extends CharacterEntity {
  public constructor(
    name: string,
    mesh: BABYLON.Mesh,
    position: number[],
    rotation: number[],
  ) {
    super(name, mesh, position, rotation);
  }
}
