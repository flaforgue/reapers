import * as BABYLON from '@babylonjs/core';
import { setParticleSystemColor } from '../../../utils';
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

  highlightMesh.setEnabled(false);
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
  material.alpha = 0.7;
  highlightMesh.material = material;
  new BABYLON.HighlightLayer('hl1', scene).addMesh(highlightMesh, color);

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
  setParticleSystemColor(ps, particleColor);
  ps.createDirectedCylinderEmitter(
    range,
    0.1,
    0,
    BABYLON.Vector3.Up(),
    BABYLON.Vector3.Up(),
  );
  ps.particleTexture = particleTexture;
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
