const { isValidObjectId } = require("../../utils/validators");

const validateObjectIdParam = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
  };
};

module.exports = { validateObjectIdParam };
