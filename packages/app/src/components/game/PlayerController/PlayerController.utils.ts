import * as BABYLON from '@babylonjs/core';
import { Key } from '../../../configs/keycodes.config';

export function isFrontMoveDirection(value: string): boolean {
  return ([Key.z, Key.s] as string[]).indexOf(value) != -1;
}

export function isSideMoveDirection(value: string): boolean {
  return ([Key.a, Key.e] as string[]).indexOf(value) != -1;
}

export function createHighlightMesh(scene: BABYLON.Scene): BABYLON.Mesh {
  const highlightMesh = BABYLON.MeshBuilder.CreateDisc('highlightMesh', {
    radius: 1,
  });

  highlightMesh.setEnabled(false);
  highlightMesh.rotate(BABYLON.Axis.X, Math.PI / 2);
  highlightMesh.animations.push(
    new BABYLON.Animation(
      'scalingAnimation',
      'scaling',
      100,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
    ),
  );

  highlightMesh.material = new BABYLON.StandardMaterial('highlightMeshMat', scene);
  highlightMesh.material.alpha = 0.5;
  (highlightMesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(
    1,
    0.3,
    0.1,
  );

  return highlightMesh;
}
