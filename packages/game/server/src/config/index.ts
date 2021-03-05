export default {
  port: process.env.PORT ?? 4001,
  web: {
    url: 'http://localhost:3000',
  },
  nbMaxPlayers: 100,
  fps: 60,
};
