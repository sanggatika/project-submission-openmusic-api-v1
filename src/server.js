// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/openmusic');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicValidator = require('./validator/openmusic');

const init = async () => {
  const songsService = new OpenMusicService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: OpenMusicValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
