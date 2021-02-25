export default {
  port: process.env.PORT ?? 4002,
  client: {
    url: 'http://localhost:3000',
  },
  nbMaxPlayers: 100,
};
