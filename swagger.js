const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Music Library API',
        description: 'API to manage a music library.'
    },
    // host: 'https://cse341musiclibrary.onrender.com',
    host: 'localhost:8080',
    schemes: ['http'],
    basePath: '/',
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);

module.exports = router;