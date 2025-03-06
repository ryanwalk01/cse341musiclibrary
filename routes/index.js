const router = require('express').Router();

router.use('/api-docs', require('./swagger'));

router.use('/towers', require('./towers'));

router.use('/shrines', require('./shrines'));



module.exports = router;
