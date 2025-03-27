const { ObjectId } = require("mongodb");

const isValidObjectId = (id) => {
  return ObjectId.isValid(id);
};

module.exports = { isValidObjectId };
