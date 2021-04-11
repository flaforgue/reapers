import * as BABYLON from 'babylonjs';
import BaseEntity from './base.entity';

function getRandomVector3(origin: BABYLON.Vector3, distances: BABYLON.Vector3) {
  return new BABYLON.Vector3(
    Math.floor(Math.random() * distances.x * 2 - distances.x) + origin.x,
    Math.floor(Math.random() * distances.y * 2 - distances.y) + origin.y,
    Math.floor(Math.random() * distances.z * 2 - distances.z) + origin.z,
  );
}

export function getRandomPosition(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin, new BABYLON.Vector3(distance, 0, distance));
}

export function getRandomRotation(origin: BABYLON.Vector3, distance: number) {
  return getRandomVector3(origin, new BABYLON.Vector3(0, distance, 0));
}

export function removeFromArrayById(arr: BaseEntity[], id: string) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
}
