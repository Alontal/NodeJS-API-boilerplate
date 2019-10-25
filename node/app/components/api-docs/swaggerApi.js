const express = require('express');

const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerDefinition } = require('.');

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./node/app/components/**/*Api.js'],
  options: { explorer: false }, // <-- not in the definition, but in the options
  customCss: '.swagger-ui .topbar { display: none }'
});

/**
 * @swagger
 * /findUser:
 *   get:
 *     tags:
 *       - Users
 *     name: Find user
 *     summary: Finds a user
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required:
 *           - username
 *     responses:
 *       200:
 *         description: A single user object
 *         schema:
 *           $ref: '#/definitions/User'
 *       401:
 *         description: No auth token
 */
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
