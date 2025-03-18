const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Music Library API',
        description: 'API to manage a music library.'
    },
    /* host: 'cse341musiclibrary.onrender.com', */
    /* host: '127.0.0.1:8080', */ //<--Uncomment for local test
    schemes: ['http','https'],
    basePath: '/',
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);

module.exports = router;