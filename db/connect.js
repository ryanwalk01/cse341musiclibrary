const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized');
    return callback(null, _db);
  }

  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      _db = client.db();
      return callback(null, _db);
    })
    .catch((err) => {
      return callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    console.error("Database connection failed");
    throw new Error("Database connection failed");
}
console.log("Database connected successfully");
return _db;
};

module.exports = {
  initDb,
  getDb
};
