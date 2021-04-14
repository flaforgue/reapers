import * as BABYLON from 'babylonjs';

const fps = 60;

export default {
  port: process.env.PORT ?? 4001,
  web: {
    url: 'http://localhost:8080',
  },
  nbMaxPlayers: 100,
  fps,
  moveStep: 0.07,
  gravity: -2,
  playerInitialPosition: BABYLON.Vector3.Zero(),
};
