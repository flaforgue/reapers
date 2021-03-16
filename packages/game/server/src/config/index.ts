const targetFps = 60;
const fps = 60;
const speed = targetFps / fps;

export default {
  port: process.env.PORT ?? 4001,
  web: {
    url: 'http://localhost:8080',
  },
  nbMaxPlayers: 100,
  fps,
  moveStep: 0.07 * speed,
  rotationStep: 2 * speed,
};
