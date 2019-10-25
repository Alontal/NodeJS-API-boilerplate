module.exports = {
  put: {
    description: 'Sign in, gets a token and save persistent session ',
    operationId: 'validate-user',
    produces: ['application/json'],
    parameters: [
      {
        name: 'Content-Type: application/json',
        in: 'header',
        description: 'Header',
        required: false,
        schema: {
          type: 'string'
        }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                description: 'email to validate',
                type: 'string'
              },
              password: {
                description: 'password to validate',
                type: 'string'
              }
            },
            examples: {
              foo: '054222222',
              summary: 'A foo example',
              value: {
                foo: 'bar'
              }
            },
            required: ['status']
          }
        }
      }
    },
    responses: {
      200: {
        schema: {
          $ref: '#/definitions/200'
        }
      },
      401: {
        schema: {
          $ref: '#/definitions/401'
        }
      },
      403: {
        schema: {
          $ref: '#/definitions/403'
        }
      },
      500: {
        description: 'Unexpected error',
        schema: {
          $ref: '#/definitions/500'
        }
      }
    }
  }
};
