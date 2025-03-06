const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger.json');

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = router;