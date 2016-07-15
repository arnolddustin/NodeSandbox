'use strict';
var config = require('config');

let Hapi = require('hapi');

let port = process.env.PORT || 3000;

const server = new Hapi.Server();
server.connection({ port: port });

server.register(require('inert'), (err) => {

  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: config.settings.clientpath
      }
    }
  });

  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});

require('./api/widgets').registerApi(server);
require('./api/profiles').registerApi(server);
