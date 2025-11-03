global.Promise = require('bluebird');

const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const glob = require('glob');
const mongoose = require('mongoose');

const http = require('http');

const { ruruHTML } = require('ruru/server');

const config = require('./config');

// Check if this is GraphiQL-only mode
const isGraphiQLOnly = process.env.GRAPHIQL_ONLY === 'true';

// Middleware: Bodyparser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

if (isGraphiQLOnly) {
  // GraphiQL-only mode: only serve GraphQL and GraphiQL
  console.log('Running in GraphiQL-only mode');

  // Graphql endpoint
  app.all('/graphql', require('./graphql/graphqlHandler'));

  // GraphiQL interface
  app.get('/graphiql', (req, res) => {
    const html = ruruHTML({
      endpoint: '/graphql',
      title: 'MARRVEL GraphiQL Interface',
    });
    res.send(html);
  });

  // Redirect root to GraphiQL
  app.get('/', (req, res) => {
    res.redirect('/graphiql');
  });

  // Handle any other routes
  app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found. This server only serves GraphiQL interface.' });
  });
} else {
  // Normal mode: serve all APIs and static files

  // Use routers for API
  const routes = glob.sync(`${config.root}/routers/*.js`);
  routes.forEach((router) => {
    app.use('/data', require(router));
  });

  // Graphql
  app.all('/graphql', require('./graphql/graphqlHandler'));

  if (config.env !== 'production') {
    // GraphiQL interface
    app.get('/graphiql', (req, res) => {
      const html = ruruHTML({
        endpoint: '/graphql',
        title: 'MARRVEL GraphiQL Interface',
      });
      res.send(html);
    });
  }
}

// Check liftOver Configuration (only needed in normal mode)
if (!isGraphiQLOnly) {
  if (!config.liftoverCmdTool || !config.liftoverCmdTool.path ||
    !(config.liftoverCmdTool.Human?.hg19?.Human?.hg38) ||
    !(config.liftoverCmdTool.Human?.hg38?.Human?.hg19)) {
    throw new Error('Error: liftOver command line tool is not configured properly.');
  }

  app.use(express.static('../dist/MARRVEL'));

  app.get('/doc', (req, res) => {
    res.sendFile(path.join(config.root, '../dist/doc/index.html'));
  });
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.root, '../dist/MARRVEL/index.html'));
  });
}

console.log(`Running @ ${config.env}`);
if (isGraphiQLOnly) {
  console.log('GraphiQL-only mode enabled');
} else {
  console.log(`DECIPHER control data using collection ${config.decipher.control.name}`);
  console.log(`DECIPEHR disease data using collection ${config.decipher.disease.name}`);
  console.log(`DECIPHER disease access is restricted to ${config.decipher.disease.allowedReferer}`);
}

const httpServer = http.createServer(app);
// Mongoose
mongoose.connect(`${config.mongo.url}?authSource=admin`, {
  dbName: config.mongo.database,
  user: config.mongo.username,
  pass: config.mongo.password,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to Mongo DB');
    httpServer.listen(config.port, () => {
      console.log(`Listening ${config.port}`);
    });
  }).catch((err) => {
    console.log('Error connecting Mongo DB');
    console.error(err);
  });

