import React, { useEffect, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import { WorldDTO } from '@reapers/game-client';

const createLight = (scene: BABYLON.Scene): BABYLON.HemisphericLight => {
  return new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
};

const createSound = (scene: BABYLON.Scene): BABYLON.Sound => {
  return new BABYLON.Sound('cello', '/sounds/battle.wav', scene, null, {
    loop: true,
    autoplay: false,
  });
};

const createGround = (width: number, depth: number, scene: BABYLON.Scene): BABYLON.Mesh => {
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width, height: depth });
  const texture = new BABYLON.Texture('/textures/ground.png', scene);
  texture.uScale = 10;
  texture.vScale = 10;
  const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  groundMat.diffuseTexture = texture;
  ground.material = groundMat;

  return ground;
};

type WorldProps = {
  scene: BABYLON.Scene | undefined;
  world: WorldDTO;
};

const World: React.FC<WorldProps> = (props) => {
  const [ground, setGround] = useState<BABYLON.Mesh>();
  const [light, setLight] = useState<BABYLON.HemisphericLight>();
  const [sound, setSound] = useState<BABYLON.Sound>();

  useEffect(() => {
    if (props.scene) {
      light?.dispose();
      setLight(createLight(props.scene));

      sound?.dispose();
      setSound(createSound(props.scene));
    }
  }, [props.scene]);

  useEffect(() => {
    if (props.scene) {
      ground?.dispose();

      setGround(createGround(props.world.width, props.world.depth, props.scene));
    }
  }, [props.world.depth, props.world.width]);

  return null;
};

export default World;
