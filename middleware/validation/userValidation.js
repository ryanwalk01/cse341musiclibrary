const { body } = require("express-validator");

const validateCreateUser = [
  body("email")
  .isEmail()
  .withMessage("A valid email is required"),

  body("firstName")
  .trim()
  .notEmpty().withMessage("First name is required"),

  body("lastName")
  .trim()
  .notEmpty()
  .withMessage("Last name is required"),

  body("role")
  .optional()
  .isString()
  .withMessage("Role must be a string"),
];

const validateUpdateUser = [
  body("email").optional().isEmail().withMessage("Email must be valid"),

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),

  body("role").optional().isString().withMessage("Role must be a string"),
];

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};


