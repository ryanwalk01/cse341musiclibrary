const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized');
    return callback(null, _db);
  }

  MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true })
    .then((client) => {
      _db = client;
      return callback(null, _db);
    })
    .catch((err) => {
      return callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
