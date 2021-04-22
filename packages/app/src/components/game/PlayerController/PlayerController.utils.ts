import * as BABYLON from '@babylonjs/core';
import { Vector3DTO } from '@reapers/game-client';
import { createVector3 } from '../../../utils';
import { Key } from '../../../configs/keycodes.config';

export function isFrontMoveDirection(value: string): boolean {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string): boolean {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}

export function createHighlightMesh(scene: BABYLON.Scene): BABYLON.Mesh {
  const highlightMesh = BABYLON.MeshBuilder.CreatePolyhedron('highlightMesh', {
    type: 1,
    sizeX: 0.5,
    sizeY: 0.8,
    sizeZ: 0.5,
  });

  highlightMesh.animations.push(
    new BABYLON.Animation(
      'scalingAnimation',
      'scaling',
      100,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    ),
  );
  highlightMesh.animations[0].setKeys([
    {
      frame: 0,
      value: new BABYLON.Vector3().setAll(0),
    },
    {
      frame: 10,
      value: new BABYLON.Vector3().setAll(1),
    },
    {
      frame: 20,
      value: new BABYLON.Vector3().setAll(0.7),
    },
    {
      frame: 30,
      value: new BABYLON.Vector3().setAll(1),
    },
  ]);
  highlightMesh.animations.push(
    new BABYLON.Animation(
      'rotationAnimation',
      'rotation',
      100,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
    ),
  );
  highlightMesh.animations[1].setKeys([
    {
      frame: 0,
      value: new BABYLON.Vector3(0, 0, 0),
    },
    {
      frame: 400,
      value: new BABYLON.Vector3(0, 2 * Math.PI, 0),
    },
  ]);

  const color = new BABYLON.Color3(1, 0.3, 0.1);
  const material = new BABYLON.StandardMaterial('highlightMeshMat', scene);
  material.diffuseColor = color;
  material.emissiveColor = color;
  material.alpha = 0;
  highlightMesh.material = material;
  new BABYLON.HighlightLayer('hl1', scene).addMesh(highlightMesh, color);

  return highlightMesh;
}

export function createRangeMesh(
  groundMesh: BABYLON.GroundMesh,
  position: Vector3DTO,
  range: number,
): BABYLON.Mesh {
  const rangeMesh = BABYLON.MeshBuilder.CreateDecal('rangeMesh', groundMesh, {
    position: createVector3(position),
    size: new BABYLON.Vector3().setAll(range),
  });
  const scene = rangeMesh.getScene();
  const material = new BABYLON.StandardMaterial('rangeMeshMat', scene);
  const texture = new BABYLON.Texture('/textures/whiteCircle.png', scene);
  texture.hasAlpha = true;
  material.diffuseTexture = texture;
  material.zOffset = -2;
  rangeMesh.material = material;

  return rangeMesh;
}
