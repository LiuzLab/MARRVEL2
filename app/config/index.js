const path = require('path'),
      rootPath = path.normalize(__dirname + '/..'),
      env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    env: env,
    root: rootPath,
    port: process.env.PORT || 8080
  },

  production: {
    env: env,
    root: rootPath,
    port: 8080,
    host: 'marrvel.org'
  }
};

config[env].mongo = require(path.join(rootPath, 'config/mongo', env + '.json'));
config[env].mongo.url = 'mongodb://' + config[env].mongo.username + ':' + config[env].mongo.password
                          + '@' + config[env].mongo.host + ':' + config[env].mongo.port
                          + '/' + config[env].mongo.database;

config[env].omim = require(path.join(rootPath, 'config/omim', env + '.json'));

module.exports = config[env];

