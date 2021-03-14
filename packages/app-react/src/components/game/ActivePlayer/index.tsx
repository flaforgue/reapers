import React, { useCallback, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import { MoveDirection, PlayerDTO, RotationDirection } from '@reapers/game-client';
import { Key } from '../../../configs/keycodes.config';
import Player from '../Player';

const isRotationDirection = (value: string): boolean => {
  return ([Key.d, Key.q] as string[]).indexOf(value) != -1;
};

const isMoveDirection = (value: string): boolean => {
  return ([Key.z, Key.s, Key.a, Key.e] as string[]).indexOf(value) != -1;
};

type ActivePlayerProps = {
  scene: BABYLON.Scene | undefined;
  player: PlayerDTO;
  camera: BABYLON.FollowCamera | undefined;
  updateMoveDirection: (direction: MoveDirection) => void;
  updateRotationDirection: (direction: RotationDirection) => void;
  frameIndex: number;
};

const ActivePlayer: React.FC<ActivePlayerProps> = (props) => {
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
    [props.updateMoveDirection, props.updateRotationDirection],
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
  }, [props.scene, keyboardEventHandler]);

  return (
    <Player
      frameIndex={props.frameIndex}
      scene={props.scene}
      player={props.player}
      camera={props.camera}
    />
  );
};

export default ActivePlayer;
