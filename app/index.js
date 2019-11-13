const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const glob = require('glob');
const mongoose = require('mongoose');

const config = require('./config');

// Middleware: Bodyparser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use routers for API
const routes = glob.sync(config.root + '/routers/*.js');
routes.forEach((router) => {
  app.use('/data', require(router));
});

app.use(express.static('dist/MARRVEL'));

app.get('*', (req, res) => {
  res.sendFile(path.join(config.root, '../dist/MARRVEL/index.html'));
});

// Mongoose
mongoose.connect(config.mongo.url + '?authSource=admin', {
  dbName: config.mongo.database,
  user: config.mongo.username,
  pass: config.mongo.password,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to Mongo DB');
    const db = mongoose.connection;

    app.listen(config.port, () => {
      console.log('Listening ' + config.port);
    });
  }).catch((err) => {
    console.log('Error connecting Mongo DB');
    console.error(err);
  });

