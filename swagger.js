const router = require('express').Router();
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Music Library API',
        description: 'API to manage a music library.'
    },
    /* host: 'cse341musiclibrary.onrender.com', */
    host: process.env.HOST || '127.0.0.1:8080', //<--Uncomment choose http for local test
    schemes: ['http','https'],
    basePath: '/',
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);

module.exports = router;