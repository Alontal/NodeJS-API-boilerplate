module.exports = {
	post: {
		description: 'Insert new User for with any kind of role',
		operationId: 'insert-user',
		produces: ['application/json'],
		parameters: [
			{
				name: 'x-access-token',
				in: 'header',
				description: 'JWT token',
				required: true,
				schema: {
					$ref: '#/definitions/Token'
				}
			},
			// {
			//   "name": "Content-Type: application/x-www-form-urlencoded",
			//   "in": "header",

			// },
			{
				name: 'user',
				in: 'body',
				description: 'User',
				required: true,
				schema: {
					$ref: '#/definitions/User'
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
							}
						},
						examples: {
							foo: 'ss',
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
				description: 'successful request',
				schema: {
					$ref: '#/definitions/200'
				}
			},
			'403': {
				description: 'Authentication  Failed',
				schema: {
					$ref: '#/definitions/403'
				}
			},
			'500': {
				description: 'Unexpected error',
				schema: {
					$ref: '#/definitions/500'
				}
			}
		}
	}
};