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
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: 'DECIPHERControl' + (process.env.DECIPHER_CONTROL_VERSION ? '.' + process.env.DECIPHER_CONTROL_VERSION : '')
      },
      disease: {
        allowedReferer: process.env.RESTRICT_DECIPHER_DISEASE ? new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i') : new RegExp('.*'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: 'DECIPHERDisease' + (process.env.DECIPHER_DISEASE_VERSION ? '.' + process.env.DECIPHER_DISEASE_VERSION : '')
      }
    }
  },

  test: {
    env: env,
    root: rootPath,
    port: process.env.PORT || 8080,
    transvar: {
      path: '../env/bin/transvar'
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: 'DECIPHERControl' + (process.env.DECIPHER_CONTROL_VERSION ? '.' + process.env.DECIPHER_CONTROL_VERSION : '')
      },
      disease: {
        allowedReferer: process.env.RESTRICT_DECIPHER_DISEASE ? new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i') : new RegExp('.*'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: 'DECIPHERDisease' + (process.env.DECIPHER_DISEASE_VERSION ? '.' + process.env.DECIPHER_DISEASE_VERSION : '')
      }
    }
  },

  production: {
    env: env,
    root: rootPath,
    port: 8080,
    host: 'marrvel.org',
    transvar: {
      path: 'transvar'
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: 'DECIPHERControl' + (process.env.DECIPHER_CONTROL_VERSION ? '.' + process.env.DECIPHER_CONTROL_VERSION : '')
      },
      disease: {
        allowedReferer: process.env.RESTRICT_DECIPHER_DISEASE ? new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i') : new RegExp('.*'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: 'DECIPHERDisease' + (process.env.DECIPHER_DISEASE_VERSION ? '.' + process.env.DECIPHER_DISEASE_VERSION : '')
      }
    }
  }
};

config[env].mongo = require(path.join(rootPath, 'config/mongo', env + '.json'));
config[env].mongo.url = 'mongodb://' + config[env].mongo.username + ':' + config[env].mongo.password
                          + '@' + config[env].mongo.host + ':' + config[env].mongo.port
                          + '/' + config[env].mongo.database;

config[env].omim = require(path.join(rootPath, 'config/omim', env + '.json'));

config[env].liftover = {
  hg38Version: process.env.LIFTOVER_HG38_VERSION || 'hg38_201312',
  hg19Version: process.env.LIFTOVER_HG19_VERSION || 'hg19_200902',
};

config[env].string = process.env.STRING_VERSION || '12.0';
config[env].ensemblGene = process.env.ENSEMBL_GENE_VERSION || 'GRCh38.p14';

config[env].https = require(path.join(rootPath, 'config/https', env + '.json'));

module.exports = config[env];

