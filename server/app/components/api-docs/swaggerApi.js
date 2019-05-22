const express = require('express');
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerDefinition } = require('./');

const options = {
	swaggerDefinition,
	apis: ['./verify/'], // <-- not in the definition, but in the options
};
const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;