module.exports = {
  post: {
    description: 'Login to and get token',
    operationId: 'validate-user',
    produces: ['application/json'],
    parameters: [
      {
        name: 'Content-Type: application/x-www-form-urlencoded',
        in: 'header',
        description: 'Header',
        required: false
      },
      // {
      //   "name": "Content-Type: application/x-www-form-urlencoded",
      //   "in": "header",

      // },
      {
        name: 'email(username)',
        in: 'body',
        description: 'Email used to sign up',
        required: true,
        schema: {
          $ref: '#/definitions/Email'
        }
      },
      {
        name: 'password',
        in: 'body',
        description: 'Password used to sign up',
        required: true,
        schema: {
          $ref: '#/definitions/Password'
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
      '200': {
        description: 'successful login',
        schema: {
          $ref: '#/definitions/LoginSuccess'
        }
      },
      '403': {
        description: 'Authentication  Failed'
      },
      '500': {
        description: 'Unexpected error'
      }
    }
  }
};
