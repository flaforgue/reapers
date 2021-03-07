export default {
  port: process.env.PORT ?? 4001,
  web: {
    url: 'http://localhost:3000',
  },
  nbMaxPlayers: 100,
  fps: 60,
  player: {
    moveStep: 0.05,
    rotationStep: 2,
  },
};
