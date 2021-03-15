import React, { EffectCallback, useCallback, useEffect, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import { PlayerDTO } from '@reapers/game-client-react';

enum AnimationKey {
  Defeat = 0,
  Idle = 1,
  Pickup = 2,
  Punch = 3,
  ReceiveHit = 4,
  Shoot = 5,
  SitDown = 6,
  StandUp = 7,
  Victory = 8,
  Walk = 9,
  WalkCarry = 10,
}

type PlayerProps = {
  camera?: BABYLON.FollowCamera;
  player: PlayerDTO;
  scene: BABYLON.Scene | undefined;
  frameIndex: number;
};

const Player: React.FC<PlayerProps> = (props) => {
  const [assets, setAssets] = useState<BABYLON.AssetContainer>();
  const [currentAnimation, setCurrentAnimation] = useState<BABYLON.AnimationGroup>();
  const loadAssets = useCallback(() => {
    if (props.scene) {
      BABYLON.SceneLoader.LoadAssetContainerAsync(
        '/models/',
        'characters/player.glb',
      ).then((result) => {
        result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        result.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
        result.animationGroups[AnimationKey.Walk].speedRatio = 2;

        for (let i = 0; i < result.animationGroups.length; i++) {
          result.animationGroups[i].reset().stop();
        }

        result.addAllToScene();
        setAssets(result);
      });
    }
  }, [props.scene]);
  useEffect(loadAssets, [loadAssets]);

  const switchAnimation = useCallback(
    (animationKey: AnimationKey) => {
      if (assets?.animationGroups) {
        const newAnimation = assets.animationGroups[animationKey];

        if (currentAnimation !== newAnimation) {
          currentAnimation?.stop();
          setCurrentAnimation(newAnimation);
          newAnimation?.play(true);
        }
      }
    },
    [currentAnimation, setCurrentAnimation, assets?.animationGroups],
  );

  const updatePlayer = useCallback(() => {
    if (props.camera) {
      if (assets?.meshes[0] && props.player) {
        assets.meshes[0].position = new BABYLON.Vector3(...props.player.position);
        assets.meshes[0].rotation = new BABYLON.Vector3(...props.player.rotation);

        if (props.player.moveDirection) {
          switchAnimation(AnimationKey.Walk);
        } else {
          switchAnimation(AnimationKey.Idle);
        }
      }
    }
  }, [props.frameIndex]);
  useEffect(updatePlayer, [updatePlayer]);

  const attachCamera = useCallback(() => {
    if (props.camera && assets?.meshes[0]) {
      props.camera.lockedTarget = assets?.meshes[0];
    }
  }, [props.camera, assets?.meshes]);
  useEffect(attachCamera, [attachCamera]);

  const disposeAssetsOnUnmount = useCallback(
    (): ReturnType<EffectCallback> => () => {
      assets?.dispose();
    },
    [assets],
  );
  useEffect(disposeAssetsOnUnmount, [disposeAssetsOnUnmount]);

  return null;
};

export default Player;
