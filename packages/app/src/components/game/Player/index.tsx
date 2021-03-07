import React, { useCallback, useEffect, useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import { MoveDirection, PlayerDTO, RotationDirection } from '@reapers/game-client';
import { Key } from '../../../configs/keycodes.config';

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

const isRotationDirection = (value: string): boolean => {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
};

const isMoveDirection = (value: string): boolean => {
  return ([Key.z, Key.s, Key.a, Key.e] as string[]).indexOf(value) != -1;
};

type PlayerProps = {
  scene: BABYLON.Scene | undefined;
  camera: BABYLON.FollowCamera | undefined;
  player: PlayerDTO;
  updateMoveDirection: (direction: MoveDirection) => void;
  updateRotationDirection: (direction: RotationDirection) => void;
};

const Player: React.FC<PlayerProps> = (props) => {
  const [meshes, setMeshes] = useState<BABYLON.AbstractMesh[]>([]);
  const [animations, setAnimations] = useState<
    Record<AnimationKey, BABYLON.AnimationGroup>
  >();
  const [currentAnimation, setCurrentAnimation] = useState<BABYLON.AnimationGroup>();

  useEffect(() => {
    if (props.scene) {
      BABYLON.SceneLoader.LoadAssetContainerAsync(
        '/models/',
        'characters/player.glb',
      ).then((result) => {
        result.meshes[0].scaling = new BABYLON.Vector3(0.3, 0.3, -0.3);
        result.meshes[0].rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.WORLD);
        result.animationGroups[AnimationKey.Walk].speedRatio = 2;
        setAnimations({
          [AnimationKey.Defeat]: result.animationGroups[AnimationKey.Defeat],
          [AnimationKey.Idle]: result.animationGroups[AnimationKey.Idle],
          [AnimationKey.Pickup]: result.animationGroups[AnimationKey.Pickup],
          [AnimationKey.Punch]: result.animationGroups[AnimationKey.Punch],
          [AnimationKey.ReceiveHit]: result.animationGroups[AnimationKey.ReceiveHit],
          [AnimationKey.Shoot]: result.animationGroups[AnimationKey.Shoot],
          [AnimationKey.SitDown]: result.animationGroups[AnimationKey.SitDown],
          [AnimationKey.StandUp]: result.animationGroups[AnimationKey.StandUp],
          [AnimationKey.Victory]: result.animationGroups[AnimationKey.Victory],
          [AnimationKey.Walk]: result.animationGroups[AnimationKey.Walk],
          [AnimationKey.WalkCarry]: result.animationGroups[AnimationKey.WalkCarry],
        });

        result.addAllToScene();

        setMeshes(result.meshes);
      });
    }
  }, [props.scene]);

  useEffect(() => {
    if (meshes[0] && props.player) {
      meshes[0].setAbsolutePosition(new BABYLON.Vector3(...props.player.position));
      meshes[0].rotation = new BABYLON.Vector3(...props.player.rotation);

      if (props.player.moveDirection) {
        switchAnimation(currentAnimation, AnimationKey.Walk);
      } else {
        switchAnimation(currentAnimation, AnimationKey.Idle);
      }
    }
  });

  // currentAnimation is a parameter for optimization purpose
  const switchAnimation = useCallback(
    (
      currentAnimation: BABYLON.AnimationGroup | undefined,
      animationKey: AnimationKey,
    ): void => {
      if (animations) {
        const animation = animations[animationKey];

        if (currentAnimation !== animation) {
          currentAnimation?.stop();
          setCurrentAnimation(animation);
          animation?.play(true);
        }
      }
    },
    [animations, setCurrentAnimation],
  );

  const keyboardEventHandler = useCallback(
    ({ type, event }: BABYLON.KeyboardInfo) => {
      if (type === BABYLON.KeyboardEventTypes.KEYDOWN) {
        switch (event.key) {
          case Key.z:
            props.updateMoveDirection(MoveDirection.Forward);
            break;
          case Key.s:
            props.updateMoveDirection(MoveDirection.Backward);
            break;
          case Key.a:
            props.updateMoveDirection(MoveDirection.Left);
            break;
          case Key.e:
            props.updateMoveDirection(MoveDirection.Right);
            break;
          case Key.d:
            props.updateRotationDirection(RotationDirection.Right);
            break;
          case Key.q:
            props.updateRotationDirection(RotationDirection.Left);
            break;
          default:
            break;
        }
      } else {
        if (isMoveDirection(event.key)) {
          props.updateMoveDirection(MoveDirection.None);
        } else if (isRotationDirection(event.key)) {
          props.updateRotationDirection(RotationDirection.None);
        }
      }
    },
    [
      props.scene,
      props.updateMoveDirection,
      props.updateRotationDirection,
      switchAnimation,
    ],
  );

  useEffect(() => {
    if (props.scene) {
      const keyboardEventObserver = props.scene.onKeyboardObservable.add(
        keyboardEventHandler,
      );

      return (): void => {
        props?.scene?.onKeyboardObservable?.remove(keyboardEventObserver);
      };
    }
  }, [keyboardEventHandler]);

  useEffect(() => {
    if (props.camera && meshes[0]) {
      props.camera.lockedTarget = meshes[0];
    }
  }, [props.camera, meshes]);

  return null;
};

export default Player;
