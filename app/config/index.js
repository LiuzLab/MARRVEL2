const path = require('path'),
      rootPath = path.normalize(__dirname + '/..'),
      env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    env: env,
    root: rootPath,
    port: process.env.PORT || 8080,
    transvar: {
      path: '../env/bin/transvar'
    }
  },

  test: {
    env: env,
    root: rootPath,
    port: process.env.PORT || 8080,
    transvar: {
      path: '../env/bin/transvar'
    }
  },

  production: {
    env: env,
    root: rootPath,
    port: 8080,
    host: 'marrvel.org',
    transvar: {
      path: 'transvar'
    }
  }
};

config[env].mongo = require(path.join(rootPath, 'config/mongo', env + '.json'));
config[env].mongo.url = 'mongodb://' + config[env].mongo.username + ':' + config[env].mongo.password
                          + '@' + config[env].mongo.host + ':' + config[env].mongo.port
                          + '/' + config[env].mongo.database;

config[env].omim = require(path.join(rootPath, 'config/omim', env + '.json'));

config[env].decipher = {
  control: {
    version: process.env.DECIPHER_CONTROL_VERSION,
    name: 'DECIPHERControl' + (process.env.DECIPHER_CONTROL_VERSION ? '.' + process.env.DECIPHER_CONTROL_VERSION : '')
  },
  disease: {
    version: process.env.DECIPHER_DISEASE_VERSION,
    name: 'DECIPHERDisease' + (process.env.DECIPHER_DISEASE_VERSION ? '.' + process.env.DECIPHER_DISEASE_VERSION : '')
  }
};

config[env].liftover = {
  hg38Version: process.env.LIFTOVER_HG38_VERSION || 'hg38_201312',
  hg19Version: process.env.LIFTOVER_HG19_VERSION || 'hg19_200902',
};

module.exports = config[env];

