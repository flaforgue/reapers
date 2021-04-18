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

export function createRangeParticleSytem(
  scene: BABYLON.Scene,
  range: number,
): BABYLON.ParticleSystem {
  const noiseTexture = new BABYLON.NoiseProceduralTexture('perlin', 256, scene);
  noiseTexture.animationSpeedFactor = 5;
  noiseTexture.persistence = 2;
  noiseTexture.brightness = 0.5;
  noiseTexture.octaves = 2;

  const particleTexture = new BABYLON.Texture('/textures/flare.png', scene);
  const particleColor = new BABYLON.Color4(0.2, 0.2, 0.85, 1);
  const ps = new BABYLON.ParticleSystem('particles', 1000, scene);
  ps.createDirectedCylinderEmitter(
    range,
    0.1,
    0,
    BABYLON.Vector3.Up(),
    BABYLON.Vector3.Up(),
  );
  ps.particleTexture = particleTexture;
  ps.color1 = particleColor;
  ps.color2 = particleColor;
  ps.colorDead = particleColor;
  ps.noiseTexture = noiseTexture;
  ps.noiseStrength = new BABYLON.Vector3(10, 10, 10);
  ps.minEmitPower = 0.1;
  ps.maxEmitPower = 0.5;
  ps.manualEmitCount = 0;
  ps.minLifeTime = 0.2;
  ps.maxLifeTime = 0.4;
  ps.addSizeGradient(0, 0.3);
  ps.addSizeGradient(1, 0);
  ps.start();

  return ps;
}
