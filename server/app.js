global.Promise = require('bluebird');

const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const glob = require('glob');
const mongoose = require('mongoose');

const http = require('http');

const config = require('./config');

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

// Use routers for API
const routes = glob.sync(`${config.root}/routers/*.js`);
routes.forEach((router) => {
  app.use('/data', require(router));
});

app.use(express.static('../dist/MARRVEL'));

app.get('/doc', (req, res) => {
  res.sendFile(path.join(config.root, '../dist/doc/index.html'));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(config.root, '../dist/MARRVEL/index.html'));
});

console.log(`Running @ ${config.env}`);
console.log(`DECIPHER control data using collection ${config.decipher.control.name}`);
console.log(`DECIPEHR disease data using collection ${config.decipher.disease.name}`);
console.log(`DECIPHER disease access is restricted to ${config.decipher.disease.allowedReferer}`);

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

