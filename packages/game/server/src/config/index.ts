export default {
  port: process.env.PORT ?? 4001,
  client: {
    url: 'http://localhost:3000',
  },
  nbMaxPlayers: 100,
  fps: 60,
};
