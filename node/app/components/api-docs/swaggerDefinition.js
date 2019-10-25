const register = require('./auth/register');
const signIn = require('./auth/signIn');
const signOut = require('./auth/signOut');

const {
  SERVICE_NAME = 'Service name',
  SWAGGER_CONTACT_EMAIL = 'dev@email.com',
  SWAGGER_CONTACT_NAME = 'john doe'
} = process.env;

module.exports = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: `${SERVICE_NAME} API`,
    description: `Documentation for ${SERVICE_NAME}`,
    contact: {
      name: SWAGGER_CONTACT_NAME,
      email: SWAGGER_CONTACT_EMAIL
    }
  },
  externalDocs: {
    description: 'Git Readme.md',
    url: '...'
  },
  host: 'opora.io',
  basePath: '/api',
  // "schemes": [
  //   "https"
  // ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    // verify email
    '/auth/register': register,
    '/auth/sign-in': signIn,
    '/auth/sign-out': signOut
  },

  definitions: {
    User: {
      type: 'object',
      required: {
        $ref: '#/definitions/User'
      },
      properties: {
        provider: {
          type: 'string',
          $ref: '#/definitions/Provider'
        },
        first_name: {
          type: 'string'
        },
        last_name: {
          type: 'string'
        },
        email: {
          type: 'string',
          $ref: '#/definitions/Email'
        },
        password: {
          type: 'object',
          $ref: '#/definitions/Password'
        },
        role: {
          type: `enum: ['owner', 'admin', 'customer', 'limited']`
        }
      }
    },
    Preference: {
      type: 'string',
      required: false,
      properties: {
        driverId: {
          type: 'number'
        },
        preference: {
          enum: ['like', 'favorite']
        }
      },
      description: 'Used for different auth strategies'
    },

    Provider: {
      type: 'string',
      required: false,
      // properties: {
      // 	email: {
      // 		type: 'string'
      // 	}
      // },
      description: 'Used for different auth strategies'
    },

    Email: {
      type: 'string',
      required: ['email']
    },

    Password: {
      type: 'string',
      required: ['password']
    },

    Token: {
      type: 'object',
      properties: {
        token: { type: 'HS256' }
      }
    },

    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: { type: 'new object' }
      },
      description: 'successful request'
    },
    401: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        auth: {
          type: 'boolean',
          format: 'string'
        },
        message: { type: 'string' },
        description: 'Unauthorized'
      }
    },
    403: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        auth: {
          type: 'boolean',
          format: 'string'
        },
        message: { type: 'string' },
        description: 'Forbidden'
      }
    },
    500: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        message: {
          type: 'string',
          description: 'error accord'
        }
      }
    },
    LoginSuccess: {
      type: 'object',
      required: ['token', 'message'],
      properties: {
        token: {
          type: 'boolean',
          format: 'string'
        },
        data: { type: 'string' }
      }
    }
  }
};
