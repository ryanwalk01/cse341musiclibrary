const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./config/passport');

const app = express();
const port = process.env.PORT || 8080;
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');
const passport = require("passport");

// Initialize Passport
app.use(passport.initialize());

app.use(cors());
app.use(bodyParser.json());
app.use('/', require('./routes'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Catch uncaught exceptions
process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

// MongoDB initialization
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(port, () => {
        console.log(`Server is running on http://127.0.0.1:${port}`);
      });
    }
  }
});

// Export app for testing purposes
module.exports = app;
