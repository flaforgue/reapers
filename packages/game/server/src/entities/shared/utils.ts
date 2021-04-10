import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

function getRandomVector3(origin: number[], distances: number[]) {
  return new BABYLON.Vector3(
    Math.floor(Math.random() * distances[0] * 2 - distances[0]) + origin[0],
    Math.floor(Math.random() * distances[1] * 2 - distances[1]) + origin[1],
    Math.floor(Math.random() * distances[2] * 2 - distances[2]) + origin[2],
  );
}

export function getRandomPosition(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin.asArray(), [distance, 0, distance]);
}

export function getRandomRotation(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin.asArray(), [0, distance, 0]);
}

export function removeFromArrayById(arr: BaseEntity[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
}
