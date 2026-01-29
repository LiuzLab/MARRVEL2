/* eslint no-useless-escape:0 */
const path = require('path');
const rootPath = path.normalize(`${__dirname}/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    env,
    root: rootPath,
    port: process.env.PORT || 8080,
    transvar: {
      path: '../env/bin/transvar'
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: `DECIPHERControl${process.env.DECIPHER_CONTROL_VERSION ? `.${process.env.DECIPHER_CONTROL_VERSION}` : ''}`
      },
      disease: {
        allowedReferer: process.env.RESTRICT_DECIPHER_DISEASE ? new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i') : new RegExp('.*'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: `DECIPHERDisease${process.env.DECIPHER_DISEASE_VERSION ? `.${process.env.DECIPHER_DISEASE_VERSION}` : ''}`
      }
    },
    gnomad: {
      version: process.env.GNOMAD_VERSION || '2.1.1',
    }
  },

  test: {
    env,
    root: rootPath,
    port: process.env.PORT || 8080,
    transvar: {
      path: '../env/bin/transvar'
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: `DECIPHERControl${process.env.DECIPHER_CONTROL_VERSION ? `.${process.env.DECIPHER_CONTROL_VERSION}` : ''}`
      },
      disease: {
        allowedReferer: process.env.RESTRICT_DECIPHER_DISEASE ? new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i') : new RegExp('.*'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: `DECIPHERDisease${process.env.DECIPHER_DISEASE_VERSION ? `.${process.env.DECIPHER_DISEASE_VERSION}` : ''}`
      }
    },
    gnomad: {
      version: process.env.GNOMAD_VERSION || '2.1.1',
    }
  },

  production: {
    env,
    root: rootPath,
    port: 8080,
    host: 'marrvel.org',
    transvar: {
      path: 'transvar'
    },
    decipher: {
      control: {
        version: process.env.DECIPHER_CONTROL_VERSION,
        name: `DECIPHERControl${process.env.DECIPHER_CONTROL_VERSION ? `.${process.env.DECIPHER_CONTROL_VERSION}` : ''}`
      },
      disease: {
        allowedReferer: new RegExp('^(?:https?:\/\/)?(?:www\.)?marrvel.org.*', 'i'),
        version: process.env.DECIPHER_DISEASE_VERSION,
        name: `DECIPHERDisease${process.env.DECIPHER_DISEASE_VERSION ? `.${process.env.DECIPHER_DISEASE_VERSION}` : ''}`
      }
    },
    gnomad: {
      version: process.env.GNOMAD_VERSION || '2.1.1',
    }
  }
};

config[env].mongo = require(path.join(rootPath, 'config/mongo', `${env}.json`));
config[env].mongo.url = `mongodb://${config[env].mongo.username}:${config[env].mongo.password
}@${config[env].mongo.host}:${config[env].mongo.port
}/${config[env].mongo.database}`;

config[env].omim = require(path.join(rootPath, 'config/omim', `${env}.json`));
config[env].gnomad.variant = {
  name:
    config[env].gnomad.version === '2.1.1'
      ? 'GnomAD'
      : `Gnomad.${config[env].gnomad.version}`,
  defaultBuild: config[env].gnomad.version === '2.1.1' ? 'hg19' : 'hg38',
};
config[env].gnomad.gene = {
  name:
    config[env].gnomad.version === '2.1.1'
      ? 'GnomADGene'
      : `GnomadGene.${config[env].gnomad.version}`,
};
config[env].liftover = {
  hg38Version: process.env.LIFTOVER_HG38_VERSION || 'hg38_201312',
  hg19Version: process.env.LIFTOVER_HG19_VERSION || 'hg19_200902',
};
config[env].stringVersion = process.env.STRING_VERSION || '12.0';
config[env].ensemblHumanGeneVersion = process.env.ENSEMBL_HUMAN_GENE_VERSION || 'GRCh38.p14';
config[env].liftoverCmdTool = {
  path: process.env.LIFTOVER_CMD_TOOL_PATH || 'liftOver',
  Human: {
    hg19: {
      Human: {
        hg38: process.env.LIFTOVER_HG19_TO_HG38_CHAIN_PATH
      }
    },
    hg38: {
      Human: {
        hg19: process.env.LIFTOVER_HG38_TO_HG19_CHAIN_PATH
      }
    }
  }
};

config[env].https = require(path.join(rootPath, 'config/https', `${env}.json`));

module.exports = config[env];

