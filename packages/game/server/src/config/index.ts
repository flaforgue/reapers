const targetFps = 60;
const fps = 60;
const speed = targetFps / fps;

export default {
  port: process.env.PORT ?? 4001,
  web: {
    url: 'http://localhost:3000',
  },
  nbMaxPlayers: 100,
  fps,
  player: {
    moveStep: 0.05 * speed,
    rotationStep: 2 * speed,
  },
};
